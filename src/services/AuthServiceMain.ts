import { ConsultantService } from './ConsultantService'
import { ApolloError } from 'apollo-server-express'
import { signJwt } from '../utils/jwt'
import { compare } from 'bcrypt'
import { SignInInputMain, TokenDash, UserInContext } from '../entities/Auth'
import { AdminService } from './AdminService'

export class AuthServiceMain {
  async SignIn (input: SignInInputMain): Promise<TokenDash | null> {
    const consultantService = new ConsultantService()
    const adminService = new AdminService()

    const error = 'Senha ou email inválido.'

    const consultant = await consultantService.getConsultantByEmail(input.email)
    const admin = await adminService.getAdminByEmail(input.email)

    if (!consultant && !admin) {
      throw new ApolloError('Conta não encontrada!')
    }

    if (consultant) {
      if (consultant.role !== 'consultant') {
        throw new ApolloError('Inconsistência de dados, por favor, entre em contato com o suporte de TI')
      }

      if (consultant.password) {
        const passwordIsValid = await compare(input.password, consultant.password)
        if (!passwordIsValid) throw new ApolloError(error)
      }

      const token = signJwt({ _id: consultant._id, email: consultant.email, name: consultant.name, role: consultant.role }, {
        expiresIn: '1d'
      })

      return { token, role: consultant.role }
    }

    if (admin) {
      if (admin.role !== 'admin') {
        throw new ApolloError('Inconsistência de dados, por favor, entre em contato com o suporte de TI')
      }

      if (admin.password) {
        const passwordIsValid = await compare(input.password, admin.password)
        if (!passwordIsValid) throw new ApolloError(error)
      }

      const token = signJwt({ _id: admin._id, email: admin.email, name: admin.name, role: admin.role }, {
        expiresIn: '1d'
      })

      return { token, role: admin.role }
    }

    return null
  }

  async getMeInContext ({ id, role }: { id: string, role: string }): Promise<UserInContext | null> {
    if (role === 'admin') {
      const adminService = new AdminService()
      const admin = await adminService.getAdminById(id)
      if (admin) {
        if (admin._id) {
          return {
            id: admin._id,
            email: admin.email,
            role: admin.role,
            name: admin.name,
            office: admin.office
          }
        }
      }
    }

    if (role === 'consultant') {
      const consultantService = new ConsultantService()
      const consultant = await consultantService.getConsultantById(id)
      if (consultant) {
        if (consultant._id) {
          return {
            id: consultant._id,
            email: consultant.email,
            role: consultant.role,
            name: consultant.name,
            office: consultant.office
          }
        }
      }
    }

    return null
  }
}
