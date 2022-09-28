import React, {useCallback} from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { Box, Text } from 'ooni-components'
import Form from 'components/network/Form'
import ChartCountry from './ChartCountry'
import SectionHeader from './SectionHeader'
import { SimpleBox } from './boxes'
import FormattedMarkdown from '../FormattedMarkdown'

const WebsitesSection = ({ countryCode }) => {
  const router = useRouter()
  const query = router.query

  // Sync page URL params with changes from form values
  const onChange = useCallback(({ since, until }) => {
    const params = {
      since,
      until,
    }

    const href = {
      pathname: router.pathname.replace('[countryCode]', countryCode),
      query: params,
    }

    if (query.since !== since
      || query.until !== until
    ) {
      router.push(href, href, { shallow: true })
    }

  }, [router, query, countryCode])

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

        <Form onChange={onChange} query={query} />

        <Box my={4}>
          <ChartCountry
            testName='web_connectivity'
            queryParams={{axis_y: 'domain'}}
          />
        </Box>
      </React.Fragment>
  )
}

export default WebsitesSection
