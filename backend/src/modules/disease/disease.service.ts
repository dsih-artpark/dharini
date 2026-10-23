import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Disease } from 'src/entities/disease.entity';
import { ILike, In, Repository } from 'typeorm';
import { StatusType } from '../../common/enums/status.enum';
import { CreateDiseaseDto } from './dto/create-disease.dto';
import { UpdateDiseaseDto } from './dto/update-disease.dto';

import { SampleStatus } from 'src/common/enums/sample-status.enum';
import { TestResultType } from 'src/common/enums/test-result.enum';
import { LabTest } from 'src/entities/lab-test.entity';
import { Sample } from 'src/entities/sample.entity';
import { Team } from 'src/entities/team.entity';
import { User } from 'src/entities/user.entity';
import { Project } from 'src/entities/project.entity';
import { TenantScopeService } from 'src/common/authorization/tenant-scope.service';

@Injectable()
export class DiseaseService {
  constructor(
    @InjectRepository(Disease)
    private readonly diseaseRepository: Repository<Disease>,
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(LabTest)
    private readonly labTestRepository: Repository<LabTest>,
    @InjectRepository(Sample)
    private readonly sampleRepository: Repository<Sample>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly tenantScopeService: TenantScopeService,
  ) {}

  async findAll(query: any): Promise<Disease[]> {
    const { shortName } = query;
    const whereQuery: any = {};
    if (shortName) {
      whereQuery.shortName = ILike(shortName);
    }
    return this.diseaseRepository.find({
      where: { ...query, status: StatusType.ACTIVE },
    });
  }

  async getDiseaseWiseSample(
    user,
    startDate: Date,
    endDate: Date,
  ): Promise<any> {
    try {
      // B4/A11: this used to re-fetch the user with a hand-picked relations
      // list that omitted `roles.workspace`, then dereferenced `user.team.id`
      // unguarded for Scope.Team - a crash for every workspace-admin and
      // every teamless signup user, and (for Scope.Workspace, which had no
      // branch at all) a query with no team filter at all, i.e. every team
      // in every tenant. `user` here is the request's `req.user`, already
      // eager-loaded with `roles.workspace` by UserService.findOne, so it's
      // used directly rather than re-fetched - see tenant-scope.ts.
      const tenant = await this.tenantScopeService.forUser(user);

      let whereCondition: any[] = [];
      if (!tenant.isSystem) {
        if (!tenant.projectIds.length) {
          // No reachable project - fail closed, never "no filter". Matches
          // the shape of the other early-exit branches below.
          return [];
        }
        whereCondition = [{ projects: { id: In(tenant.projectIds) } }];
      }

      let teamIds: any = await this.teamRepository.find({
        where: whereCondition.length > 0 ? whereCondition : undefined,
        relations: ['projects', 'projects.createdBy'],
        select: {
          id: true,
        },
      });

      // Extract only the `id` values
      teamIds = teamIds.map((team) => team.id);

      if (!teamIds.length) {
        return [];
      }

      // Get all projects associated with the teams
      const projects = await this.projectRepository.find({
        where: { teams: { id: In(teamIds) } },
        relations: ['diseases'],
      });

      // Get unique disease IDs from all projects
      const projectDiseaseIds = [
        ...new Set(
          projects.flatMap((project) =>
            project.diseases.map((disease) => disease.id),
          ),
        ),
      ];

      if (!projectDiseaseIds.length) {
        return [];
      }

      // Step 3: Initialize Disease Statistics
      const diseaseStats: Record<
        string,
        { totalSamples: number; testedSamples: number }
      > = {};

      const diseases = await this.diseaseRepository.find({
        where: { status: StatusType.ACTIVE, id: In(projectDiseaseIds) },
      });

      const diseaseIds = diseases.map((d) => d.id);

      if (!diseaseIds.length) {
        return [];
      }

      const query = this.sampleRepository
        .createQueryBuilder('sample')
        .leftJoin('sample.diseases', 'disease')
        .select('disease.name', 'name')
        .addSelect(
          `COUNT(DISTINCT CASE 
            WHEN (sample.sampleStatus = :testedStatus OR sample.sampleStatus = 'test-report-generated') 
            THEN sample.id 
            ELSE NULL 
          END)`,
          'testedSamples',
        )
        .addSelect(
          `COUNT(DISTINCT CASE 
            WHEN EXISTS (
              SELECT 1 
              FROM lab_tests lab 
              WHERE lab."sampleId" = sample.id 
              AND (sample.sampleStatus = :testedStatus OR sample.sampleStatus = 'test-report-generated')
              AND lab."testResult" = :positiveStatus
            ) 
            THEN sample.id 
            ELSE NULL 
          END)`,
          'positiveSamples',
        )
        .where('disease.id IN (:...diseaseIds)', { diseaseIds })
        .andWhere('sample."teamId" IN (:...teamIds)', { teamIds })
        .groupBy('disease.name')
        .setParameter('testedStatus', SampleStatus.TESTED)
        .setParameter('positiveStatus', TestResultType.POSITIVE);

      // Apply BETWEEN only if both are present
      if (startDate && endDate) {
        query.andWhere('sample."createdAt" BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      }

      const rawStats = await query.getRawMany();

      // Convert array to desired object format
      diseases
        .sort((a, b) => a.index - b.index)
        .forEach((disease) => {
          const stats = rawStats.find((stat) => stat.name === disease.name);
          if (stats) {
            diseaseStats[disease.name] = {
              totalSamples: parseInt(stats.testedSamples, 10),
              testedSamples: parseInt(stats.positiveSamples, 10),
            };
          } else {
            diseaseStats[disease.name] = {
              totalSamples: 0,
              testedSamples: 0,
            };
          }
        });

      console.log('Disease Statistics:', diseaseStats);

      return { diseaseStats };
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  async findOne(query: any): Promise<Disease> {
    try {
      const role = await this.diseaseRepository.findOne({
        where: { ...query, status: StatusType.ACTIVE },
      });
      if (!role) {
        throw new NotFoundException(`Disease with query ${query} not found`);
      }
      return role;
    } catch {
      throw new NotFoundException(`Disease with ID ${query} not found`);
    }
  }

  async create(createDiseaseDto: CreateDiseaseDto): Promise<Disease> {
    const role = this.diseaseRepository.create(createDiseaseDto);
    return this.diseaseRepository.save(role);
  }

  async update(
    id: string,
    updateDiseaseDto: UpdateDiseaseDto,
  ): Promise<Disease> {
    const role = await this.diseaseRepository.preload({
      id: id,
      ...updateDiseaseDto,
    });

    if (!role) {
      // If the role does not exist, create a new one
      const newDisease = this.diseaseRepository.create({
        id,
        ...updateDiseaseDto,
      });
      return this.diseaseRepository.save(newDisease);
    }

    // If the role exists, update the existing role
    await this.diseaseRepository.save(role);

    return role;
  }

  async remove(id: string): Promise<any> {
    const deleteDto = {
      status: StatusType.DELETED,
    };
    const role = await this.diseaseRepository.preload({
      id: id,
      ...deleteDto,
    });

    // If the role exists, update the existing role
    return await this.diseaseRepository.save(role);
  }
}
