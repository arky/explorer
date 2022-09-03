import React from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Box, Text } from 'ooni-components'
import Chart from './Chart'
import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
import FormattedMarkdown from '../FormattedMarkdown'

const WebsitesSection = () => {
  const intl = useIntl()

  return (
    <React.Fragment>
        <SectionHeader>
          <SectionHeader.Title name='websites'>
            <FormattedMessage id='Country.Heading.Websites' />
          </SectionHeader.Title>
        </SectionHeader>
        <SimpleBox>
          <Text fontSize={16}>
            <FormattedMarkdown id='Country.Websites.Description' />
          </Text>
        </SimpleBox>

        <Box my={4}>
          <Chart
            testName='web_connectivity'
            title={intl.formatMessage({id: 'Tests.Groups.Webistes.Name'})}
            queryParams={{axis_y: 'domain'}}
          />
        </Box>
      </React.Fragment>
  )
}

export default WebsitesSection
