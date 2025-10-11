import { Role } from '@/generated/prisma'
import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access'

const statements = {
  ...defaultStatements,
  customer: ['create', 'read', 'update', 'delete'],
  servicerequest: ['create', 'read', 'update', 'delete'],
  invoice: ['create', 'read', 'update', 'delete'],
} as const

export const ac = createAccessControl(statements)

export const roles = {
  [Role.EMPLOYEE]: ac.newRole({
    customer: ['create', 'read', 'update', 'delete'],
    servicerequest: ['create', 'read', 'update', 'delete'],
    invoice: ['create', 'read', 'update', 'delete'],
  }),
  [Role.ADMIN]: ac.newRole({
    ...adminAc.statements,
    customer: ['create', 'read', 'update', 'delete'],
    servicerequest: ['create', 'read', 'update', 'delete'],
    invoice: ['create', 'read', 'update', 'delete'],
  }),
}
