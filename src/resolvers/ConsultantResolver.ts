import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { AddConsultantInput, Consultant, UpdatePasswordInput } from '../entities/Consutant'
import { ConsultantService } from '../services/ConsultantService'
import Context from '../context/context'

@Resolver(() => Consultant)
export class ConsultantResolver {
  constructor (
    private readonly consultantService: ConsultantService
  ) {
    this.consultantService = new ConsultantService()
  }

  @Query(() => Consultant, { nullable: true })
  @Authorized()
  async consultantMe (@Ctx() context: Context): Promise<Consultant | null> {
    if (context.user) {
      const _id = context.user._id
      return await this.consultantService.getConsultantById(_id)
    }
    return null
  }

  @Query(() => [Consultant])
  @Authorized()
  async consultants (): Promise<Consultant[]> {
    return await this.consultantService.getConsultants()
  }

  @Query(() => Consultant, { nullable: true })
  async consultant (@Arg('id', () => String) id: string): Promise<Consultant | null> {
    return await this.consultantService.getConsultantById(id)
  }

  @Mutation(() => Consultant)
  async addConsultant (@Arg('input', () => AddConsultantInput) input: AddConsultantInput): Promise<Consultant> {
    return await this.consultantService.addConsultant(input)
  }

  @Mutation(() => Consultant, { nullable: true })
  async udpatePassword (@Arg('input', () => UpdatePasswordInput) input: UpdatePasswordInput): Promise<Consultant | null> {
    const result = await this.consultantService.udpatePassword(input)
    return result
  }
}
