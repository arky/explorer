import React, { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Container, Heading, Box } from 'ooni-components'
import { FormattedMessage } from 'react-intl'
import axios from 'axios'
import dayjs from 'dayjs'

import NavBar from 'components/NavBar'
import { MetaTags } from 'components/dashboard/MetaTags'
import { Form } from 'components/dashboard/Form'
import Charts from 'components/dashboard/Charts'
import FormattedMarkdown from 'components/FormattedMarkdown'

const DashboardCircumvention = ({ availableCountries }) => {
  const router = useRouter()
  const query = router.query

  useEffect(() => {
    const { query } = router
    if (Object.keys(query).length === 0) {
      const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
      const monthAgo = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')
      const probe_cc = ['CN', 'IR', 'RU'].join(',')
      const href = {
        query: {
          since: monthAgo,
          until: tomorrow,
          probe_cc
        },
      }
      router.replace(href, undefined, { shallow: true })
    }
  }, [])

  // Sync page URL params with changes from form values
  const onChange = useCallback(({ since, until, probe_cc }) => {
    // since: "2022-01-02",
    // until: "2022-02-01",
    // probe_cc: "IT,AL,IR"
    const params = {
      since,
      until
    }
    if (probe_cc) {
      params['probe_cc'] = probe_cc
    }
    if (query.since !== since
      || query.until !== until
      || query.probe_cc !== probe_cc
    ) {
      router.push({ query: params }, undefined, { shallow: true })
    }
  }, [router, query])

  return (
    <>
      <MetaTags />
      <NavBar />
      <Container>
        <Heading h={1}><FormattedMessage id='ReachabilityDash.Heading.CircumventionTools' /></Heading>
        {router.isReady && <>
          <Box my={2} bg='gray0' p={3}>
            <FormattedMarkdown id='ReachabilityDash.CircumventionTools.Description' />
          </Box>
          <Form onChange={onChange} query={query} availableCountries={availableCountries} />
          <Charts />
        </>}
      </Container>
    </>
  )
}

// Fetch list of countries for which we have data for circumvention tools
// Used to populate the country selection list in the form
export async function getServerSideProps () {
  let availableCountries = []
  try {
    const client = axios.create({baseURL: process.env.NEXT_PUBLIC_OONI_API}) // eslint-disable-line
    const res = await client.get('/api/_/circumvention_stats_by_country')
    const { results } = res.data

    availableCountries = results.map(d => d.probe_cc)

  } catch (e) {
    console.error(e)
    // Sentry.captureException(e)
  } finally {
    return {
      props: {
        availableCountries
      }
    }
  }
}

export default DashboardCircumvention