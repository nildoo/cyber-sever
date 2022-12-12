import { AddLinkInput, AddResultsCampaingInput, RemoveImageCampaingInput, RemoveLinkInput } from './../entities/Campaing'
import { AdResults, SocialMedia } from '../entities/subdocuments/SocialMedia'
import { ApolloError } from 'apollo-server-express'
import { AddCampaingInput, AddFileCampaingInput, ApproveFileInput, Campaing, CampaingModel, AddMeetInput } from '../entities/Campaing'
import { UserContext } from '../entities/Auth'

export class CampaingService {
  async getAllCampaings (): Promise<Campaing[]> {
    try {
      const campaing = await CampaingModel.find({}).populate('client').populate('consultant').sort({ createdAt: -1 })
      return campaing
    } catch (error) {
      throw new ApolloError('Erro ao buscar dados.')
    }
  }

  async getCampaingsByClient (client: string): Promise<Campaing[]> {
    try {
      const campaing = await CampaingModel.find({ client }).populate('client').populate('consultant').sort({ createdAt: -1 })
      return campaing
    } catch (error) {
      throw new ApolloError('Erro ao buscar dados.')
    }
  }

  async getCampaingById (id: string): Promise<Campaing | null> {
    try {
      const campaing = await CampaingModel.findById(id).populate('client').populate('consultant')
      return campaing
    } catch (error) {
      throw new ApolloError('Erro ao buscar dados.')
    }
  }

  async addFileToCampaing (input: AddFileCampaingInput): Promise<Campaing | null> {
    try {
      const campaing = await CampaingModel.findById(input.id) as Campaing

      const file = {
        title: input.title,
        type: input.type,
        thumb: input.thumb,
        url: input.url,
        approved: input.approved,
        size: input.size,
        folder: input.folder,
        firebasePath: input.firebasePath
      }

      if (campaing) {
        if (input.type === 'image') {
          campaing.files.images.push(file)
          return await CampaingModel.findOneAndUpdate({ _id: input.id }, campaing, { new: true })
        }

        if (input.type === 'video') {
          campaing.files.videos.push(file)
          return await CampaingModel.findOneAndUpdate({ _id: input.id }, campaing, { new: true })
        }

        if (input.type === 'client') {
          campaing.files.signature.push(file)
          return await CampaingModel.findOneAndUpdate({ _id: input.id }, campaing, { new: true })
        }
      }

      return null
    } catch (error) {
      throw new ApolloError('Erro ao adicionar arquivos.')
    }
  }

  async removeImageFromCampaing (input: RemoveImageCampaingInput): Promise<boolean> {
    try {
      const campaing = await CampaingModel.findById(input.campaingId) as Campaing
      if (campaing) {
        if (input.folder === 'image') {
          const images = campaing.files.images.filter(file => file._id?.toString() !== input.fileId)
          const result = await CampaingModel.updateOne({ _id: input.campaingId }, {
            files: {
              videos: campaing.files.videos,
              images,
              signature: campaing.files.signature
            }
          }, { new: true })
          return !!result
        }

        if (input.folder === 'video') {
          const videos = campaing.files.videos.filter(file => file._id?.toString() !== input.fileId)
          const result = await CampaingModel.updateOne({ _id: input.campaingId }, {
            files: {
              images: campaing.files.images,
              videos,
              signature: campaing.files.signature
            }
          }, { new: true })
          return !!result
        }

        if (input.folder === 'client') {
          const signature = campaing.files.signature.filter(file => file._id?.toString() !== input.fileId)
          const result = await CampaingModel.updateOne({ _id: input.campaingId }, {
            files: {
              images: campaing.files.images,
              videos: campaing.files.videos,
              signature
            }
          }, { new: true })
          return !!result
        }
      }

      return false
    } catch (error) {
      throw new ApolloError('Erro ao adicionar arquivos.')
    }
  }

  async approveFile (input: ApproveFileInput): Promise<boolean> {
    try {
      const campaing = await CampaingModel.findById(input.id_campaing) as Campaing

      if (campaing) {
        if (input.typeFile === 'image') {
          const idx = campaing.files.images.findIndex(e => e._id?.toString() === input.id_file)

          if (idx > -1) {
            campaing.files.images[idx].approved = input.approved
          }
        }

        if (input.typeFile === 'video') {
          const idx = campaing.files.videos.findIndex(e => e._id?.toString() === input.id_file)
          if (idx > -1) {
            campaing.files.videos[idx].approved = input.approved
          }
        }
      }

      const result = await CampaingModel.updateOne({ _id: input.id_campaing }, campaing, { new: true }).populate('client')
      return !!result
    } catch (error) {
      throw new ApolloError('Erro ao adicionar arquivos.')
    }
  }

  async addCampaing (input: AddCampaingInput): Promise<Campaing> {
    try {
      const socialMedias: SocialMedia[] = input.socialMediaNames.map(media => ({
        name: media
      }))

      const campaingInput: Campaing = {
        client: input.client,
        consultant: input.consultant,
        title: input.title,
        startDate: input.startDate,
        endDate: input.endDate,
        status: 'Em andamento',
        type: input.type,
        socialMediasResults: socialMedias,
        links: [],
        files: {
          images: [],
          videos: [],
          signature: []
        }
      }
      const campaing = (await CampaingModel.create(campaingInput)).toObject() as Campaing
      return campaing
    } catch (error) {
      throw new ApolloError('Erro ao criar campanha.')
    }
  }

  async addLink (input: AddLinkInput): Promise<Campaing | null> {
    try {
      const campaing = await CampaingModel.findOneAndUpdate({ _id: input.id }, {
        $push: {
          links: { title: input.title, link: input.link }
        }
      }, { new: true })
      return campaing
    } catch (error) {
      throw new ApolloError('Erro ao buscar dados.')
    }
  }

  async addMeet (input: AddMeetInput): Promise<Campaing | null> {
    try {
      const campaing = await CampaingModel.findOneAndUpdate({ _id: input.campaingId }, {
        meet: { title: input.title, date: input.date, hour: input.date }
      }, { new: true })
      return campaing
    } catch (error) {
      throw new ApolloError('Erro ao buscar dados.')
    }
  }

  async addResultsCampaing (input: AddResultsCampaingInput): Promise<boolean> {
    try {
      const campaingResult = await CampaingModel.findById(input.campaingId) as Campaing
      if (campaingResult) {
        const idx = campaingResult.socialMediasResults.findIndex(e => e.name === input.network)
        if (idx > -1) {
          const adRes: AdResults = {
            amountSpent: input.amountSpent,
            costPerResults: input.costPerResults,
            reach: input.reach,
            results: input.results
          }
          campaingResult.socialMediasResults[idx].adResults = adRes
          const res = await CampaingModel.updateOne({ _id: input.campaingId }, campaingResult, { new: true })
          return !!res
        }
      }
      return false
    } catch (error) {
      throw new ApolloError('Erro ao buscar dados.')
    }
  }

  async removeLink (input: RemoveLinkInput): Promise<boolean> {
    try {
      const campaing = await CampaingModel.findById(input.campaingId)
      if (campaing) {
        const links = campaing.links.filter(link => link._id?.toString() !== input.linkId)
        const nc = await CampaingModel.updateOne({ _id: input.campaingId }, {
          links
        }, { new: true })
        return !!nc.modifiedCount
      }
      return false
    } catch (error) {
      throw new ApolloError('Erro ao buscar dados.')
    }
  }

  async getTotalCampaings (input: UserContext): Promise<number> {
    try {
      if (input.role === 'consultant') {
        const totalCampaings = await CampaingModel.countDocuments({ consultant: input._id })
        return totalCampaings
      } else {
        const totalCampaings = await CampaingModel.countDocuments({})
        return totalCampaings
      }
    } catch (error) {
      throw new ApolloError('Erro ao buscar campanhas')
    }
  }
}
