import {defineBlueprint, defineScheduledFunction, defineRobot} from '@sanity/blueprints'

export default defineBlueprint({
  resources: [
    defineRobot({
      name: 'pnc-robot',
      memberships: [{
        resourceType: 'project',
        resourceId: 'ya3z8htt',
        roleNames: ['editor']
      }]
    }),
    defineScheduledFunction({
      name: 'sync-episodes',
      displayName: 'Sync episodes',
      event: {
        expression: '0 6 * * *'
      },
      timeout: 60,
      robotToken: '$.resources.pnc-robot.token',
    })
  ],
})