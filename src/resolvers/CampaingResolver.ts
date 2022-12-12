import { AddResultsCampaingInput, RemoveLinkInput, AddCampaingInput, AddFileCampaingInput, AddLinkInput, ApproveFileInput, Campaing, AddMeetInput, RemoveImageCampaingInput } from '../entities/Campaing'
import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'
import { CampaingService } from '../services/CampaingService'
import Context from '../context/context'

@Resolver(() => Campaing)
export class CampaingResolver {
  constructor (
    private readonly campaingService: CampaingService

  ) {
    this.campaingService = new CampaingService()
  }

  @Query(() => [Campaing])
  @Authorized()
  async getAllCampaings (): Promise<Campaing[]> {
    return await this.campaingService.getAllCampaings()
  }

  @Query(() => Int)
  @Authorized()
  async totalCampaings (@Ctx() context: Context): Promise<number> {
    if (context.user) {
      return await this.campaingService.getTotalCampaings(context.user)
    }
    return 0
  }

  @Query(() => [Campaing])
  @Authorized()
  async getCampaingByClient (@Arg('client', () => String) client: string): Promise<Campaing[]> {
    return await this.campaingService.getCampaingsByClient(client)
  }

  @Query(() => Campaing)
  @Authorized()
  async getCampaingById (@Arg('id', () => String) id: string): Promise<Campaing | null> {
    return await this.campaingService.getCampaingById(id)
  }

  @Mutation(() => Campaing)
  @Authorized()
  async addCampaing (@Arg('input', () => AddCampaingInput) input: AddCampaingInput): Promise<Campaing> {
    return await this.campaingService.addCampaing(input)
  }

  @Mutation(() => Boolean)
  @Authorized()
  async approveFile (@Arg('input', () => ApproveFileInput) input: ApproveFileInput): Promise<boolean> {
    return await this.campaingService.approveFile(input)
  }

  @Mutation(() => Campaing, { nullable: true })
  @Authorized()
  async addLink (@Arg('input', () => AddLinkInput) input: AddLinkInput): Promise<Campaing | null> {
    return await this.campaingService.addLink(input)
  }

  @Mutation(() => Boolean)
  @Authorized()
  async removeLink (@Arg('input', () => RemoveLinkInput) input: RemoveLinkInput): Promise<boolean> {
    return await this.campaingService.removeLink(input)
  }

  @Mutation(() => Campaing, { nullable: true })
  @Authorized()
  async addMeet (@Arg('input', () => AddMeetInput) input: AddMeetInput): Promise<Campaing | null> {
    console.log(input)
    return await this.campaingService.addMeet(input)
  }

  @Mutation(() => Boolean)
  @Authorized()
  async addResultsCampaing (@Arg('input', () => AddResultsCampaingInput) input: AddResultsCampaingInput): Promise<boolean> {
    console.log(input)
    return await this.campaingService.addResultsCampaing(input)
  }

  @Mutation(() => Campaing)
  @Authorized()
  async addFilesToCampaing (@Arg('input', () => AddFileCampaingInput) input: AddFileCampaingInput): Promise<Campaing | null> {
    return await this.campaingService.addFileToCampaing(input)
  }

  @Mutation(() => Boolean)
  @Authorized()
  async removeFileFromCampaing (@Arg('input', () => RemoveImageCampaingInput) input: RemoveImageCampaingInput): Promise<boolean> {
    return await this.campaingService.removeImageFromCampaing(input)
  }
}
