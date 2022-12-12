import { AdminService } from './../services/AdminService'
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Admin, AddAdminInput } from '../entities/Admin'
import Context from '../context/context'

@Resolver(() => Admin)
export class AdminResolver {
  constructor (
    private readonly adminService: AdminService
  ) {
    this.adminService = new AdminService()
  }

  @Query(() => Admin, { nullable: true })
  @Authorized()
  async adminMe (@Ctx() context: Context): Promise<Admin | null> {
    if (context.user) {
      const _id = context.user._id
      return await this.adminService.getAdminById(_id)
    }
    return null
  }

  @Mutation(() => Admin)
  async addAdmin (@Arg('input', () => AddAdminInput) input: AddAdminInput): Promise<Admin> {
    return await this.adminService.addAdmin(input)
  }
}
