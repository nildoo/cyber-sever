import { AddConsultantInput, Consultant, ConsultantModel, UpdatePasswordInput } from './../entities/Consutant'
import { ApolloError } from 'apollo-server-express'
import { AdminModel } from '../entities/Admin'

export class ConsultantService {
  async addConsultant (input: AddConsultantInput): Promise<Consultant> {
    try {
      const isAdmin = await AdminModel.findOne({ email: input.email })

      if (isAdmin) {
        throw new ApolloError('Este usuário é um admin')
      }

      const consultantExists = await ConsultantModel.findOne({ email: input.email })

      if (consultantExists) {
        throw new ApolloError('Email já cadastrado!')
      }

      const consultant = (await ConsultantModel.create(input)).toObject() as Consultant
      return consultant
    } catch (error) {
      throw new ApolloError(String(error))
    }
  }

  async getConsultantById (_id: string): Promise<Consultant | null> {
    try {
      const consultant = await ConsultantModel.findOne({ _id })
      return consultant
    } catch (error) {
      throw new ApolloError('Erro ao buscar consultor')
    }
  }

  async getConsultantByEmail (email: string): Promise<Consultant | null> {
    try {
      return await ConsultantModel.findOne({ email })
    } catch (error) {
      throw new ApolloError('Erro ao buscar consultor')
    }
  }

  async getConsultants (): Promise<Consultant[]> {
    try {
      const consultants = await ConsultantModel.find({})
      return consultants
    } catch (error) {
      throw new ApolloError('Erro ao buscar consultores')
    }
  }

  async udpatePassword (input: UpdatePasswordInput): Promise<Consultant | null> {
    try {
      const consultant = await ConsultantModel.findOneAndUpdate({ _id: input.consultantId }, {
        password: input.password
      })
      return consultant
    } catch (error) {
      throw new ApolloError('Erro ao buscar consultores')
    }
  }
}
