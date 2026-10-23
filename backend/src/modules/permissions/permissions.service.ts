import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from 'src/entities/user.entity';
import { Permission } from 'src/entities/permission.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionsRepository: Repository<Permission>,
  ) {}

  async getPermissionsForUser(user: User): Promise<Permission[]> {
    const roles = user.roles;

    const permissions = await this.permissionsRepository
      .createQueryBuilder('permission')
      .leftJoinAndSelect('permission.roles', 'role')
      .where('role.id IN (:...roleIds)', {
        roleIds: roles.map((role) => role.id),
      })
      .getMany();

    return permissions;
  }

  async findAll(query: any): Promise<Permission[]> {
    return this.permissionsRepository.find({ where: query });
  }

  async findOne(query: any): Promise<Permission> {
    try {
      const role = await this.permissionsRepository.findOne({ where: query });
      if (!role) {
        throw new NotFoundException(`Permission with query ${query} not found`);
      }
      return role;
    } catch {
      throw new NotFoundException(`Permission with ID ${query} not found`);
    }
  }

  async create(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const role = this.permissionsRepository.create(createPermissionDto);
    return this.permissionsRepository.save(role);
  }

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<Permission> {
    // await this.permissionsRepository.update(id, updatePermissionDto);
    // const updatedPermission = await this.permissionsRepository.findOne({ where: { id } });
    // if (!updatedPermission) {
    //   throw new NotFoundException(`Permission with ID ${id} not found`);
    // }
    // return updatedPermission;

    const role = await this.permissionsRepository.preload({
      id: id,
      ...updatePermissionDto,
    });

    if (!role) {
      // If the role does not exist, create a new one
      const newPermission = this.permissionsRepository.create({
        id,
        ...updatePermissionDto,
      });
      return this.permissionsRepository.save(newPermission);
    }

    // If the role exists, update the existing role
    await this.permissionsRepository.save(role);

    return role;
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.permissionsRepository.remove(role);
  }
}
