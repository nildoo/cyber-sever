import { ApolloError } from 'apollo-server-express'
import { Admin, AdminModel, AddAdminInput } from '../entities/Admin'
import { ConsultantModel } from '../entities/Consutant'

export class AdminService {
  async getAdminByEmail (email: string): Promise<Admin | null> {
    try {
      return await AdminModel.findOne({ email })
    } catch (error) {
      throw new ApolloError('Erro ao buscar admin')
    }
  }

  async getAdminById (_id: string): Promise<Admin | null> {
    try {
      const admin = await AdminModel.findOne({ _id })
      return admin
    } catch (error) {
      throw new ApolloError('Erro ao buscar consultor')
    }
  }

  async addAdmin (input: AddAdminInput): Promise<Admin> {
    try {
      const isConsultant = await ConsultantModel.findOne({ email: input.email })

      if (isConsultant) {
        throw new ApolloError('Este usuário é um consultor')
      }

      const adminExists = await AdminModel.findOne({ email: input.email })

      if (adminExists) {
        throw new ApolloError('Email já cadastrado!')
      }

      const admin = (await AdminModel.create(input)).toObject() as Admin
      return admin
    } catch (error) {
      throw new ApolloError(String(error))
    }
  }
}
