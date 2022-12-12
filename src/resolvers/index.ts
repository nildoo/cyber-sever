import { AdminResolver } from './AdminResolver'
import { AuthResolver } from './AuthResolver'
import { ConsultantResolver } from './ConsultantResolver'
import { CampaingResolver } from './CampaingResolver'
import { ClientResolver } from './ClientResolver'

export const resolvers = [ClientResolver, CampaingResolver, ConsultantResolver, AuthResolver, AdminResolver] as const
