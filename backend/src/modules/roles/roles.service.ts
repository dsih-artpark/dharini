import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.entity';
import { In, Repository } from 'typeorm';
import { Permission } from 'src/entities/permission.entity';
import { RedisCacheService } from '../../common/cache/redis-cache.service';
import { USER_AUTH_CACHE_PREFIX } from '../../common/cache/cache-keys';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly cacheService: RedisCacheService,
  ) {}

  async findAll(query: any): Promise<Role[]> {
    return this.roleRepository.find({
      where: query,
      relations: ['permissions'],
    });
  }

  async findOne(query: any): Promise<Role> {
    try {
      const role = await this.roleRepository.findOne({
        where: query,
        relations: ['permissions'],
      });
      if (!role) {
        throw new NotFoundException(`Role with query ${query} not found`);
      }
      return role;
    } catch (error) {
      throw new NotFoundException(`Role with ID ${query} not found`);
    }
  }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    try {
      const { name, permissions } = createRoleDto;

      // Find the permissions by their ids
      const rolePermissions = await this.permissionRepository.findBy({
        id: In(createRoleDto.permissions),
      });
      console.log('permissions', permissions);
      console.log('rolePermissions', rolePermissions);
      // Create a new role and associate permissions with it
      const role = new Role();
      role.name = name;
      role.permissions = rolePermissions;

      // Save the role to the database
      return this.roleRepository.save(role);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async update(roleId: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { name, permissions } = updateRoleDto;

    // Fetch the role from the database
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    // Update the role properties
    if (name) {
      role.name = name;
    }

    if (permissions) {
      // Fetch the new permissions from the database using `findBy`
      const permissionEntities = await this.permissionRepository.findBy({
        id: In(permissions),
      });
      role.permissions = permissionEntities;
    }

    // Save the updated role
    const updated = await this.roleRepository.save(role);
    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
    await this.cacheService.delByPrefix(USER_AUTH_CACHE_PREFIX);
  }
}
