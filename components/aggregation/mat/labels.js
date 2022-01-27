import PropTypes from 'prop-types'
import { getCategoryCodesMap } from 'components/utils/categoryCodes'
import { Box } from 'ooni-components'
import countryUtil from 'country-util'

const InputRowLabel = ({ input }) => {
  const truncatedInput = input
  return (
    <Box title={input} sx={{
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }}>
      {truncatedInput}
    </Box>
  )
}

InputRowLabel.propTypes = {
  input: PropTypes.string,
}

const categoryCodesMap = getCategoryCodesMap()

const blockingTypeLabels = {
  '': '<empty>',
  'dns': 'DNS Tampering',
  'http-diff': 'HTTP Diff',
  'http-failure': 'HTTP Failure',
  'tcp_ip': 'TCP/IP Blocking'
}

export const getRowLabel = (key, yAxis) => {
  switch (yAxis) {
  case 'probe_cc':
    return countryUtil.territoryNames[key] ?? key
  case 'category_code':
    return categoryCodesMap.get(key)?.name ?? key
  case 'input':
    return (<InputRowLabel input={key} />)
  case 'blocking_type':
    return blockingTypeLabels[key] ?? key
  case 'probe_asn':
    return `AS${key}`
  default:
    return key
  }
}