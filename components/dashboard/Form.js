import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Box, Flex, Input, Button } from 'ooni-components'
import { MultiSelect } from 'react-multi-select-component'
import { useIntl } from 'react-intl'
import dayjs from 'services/dayjs'
import { format } from 'date-fns'
import { getLocalisedRegionName } from '../../utils/i18nCountries'

import { StyledLabel } from '../aggregation/mat/Form'
import DateRangePicker from '../DateRangePicker'

const tomorrow = dayjs.utc().add(1, 'day').format('YYYY-MM-DD')
const lastMonthToday = dayjs.utc().subtract(30, 'day').format('YYYY-MM-DD')

const defaultDefaultValues = {
  since: lastMonthToday,
  until: tomorrow,
  probe_cc: ['CN', 'IR', 'RU']
}

export const Form = ({ onChange, query, availableCountries }) => {
  const intl = useIntl()

  const countryOptions = useMemo(() => availableCountries
    .map(cc => ({
      label: getLocalisedRegionName(cc, intl.locale),
      value: cc
    }))
    .sort((a, b) => (new Intl.Collator(intl.locale).compare(a.label, b.label)))
  , [availableCountries, intl])

  const query2formValues = useMemo(() => {
    const countriesInQuery = query.probe_cc?.split(',') ?? defaultDefaultValues.probe_cc
    return {
      since: query?.since ?? defaultDefaultValues.since,
      until: query?.until ?? defaultDefaultValues.until,
      probe_cc: countryOptions.filter(country => countriesInQuery.includes(country.value)),
    }
  }, [countryOptions, query])

  const multiSelectStrings = useMemo(() => ({
    'allItemsAreSelected': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.AllSelected' }),
    // 'clearSearch': 'Clear Search',
    // 'clearSelected': 'Clear Selected',
    // 'noOptions': 'No options',
    'search': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.SearchPlaceholder' }),
    'selectAll': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.SelectAll' }),
    'selectAllFiltered': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.SelectAllFiltered' }),
    'selectSomeItems': intl.formatMessage({ id: 'ReachabilityDash.Form.Label.CountrySelect.InputPlaceholder' }),
    // 'create': 'Create',
  }), [intl])

  const { control, getValues, watch, setValue, reset } = useForm({
    defaultValues: query2formValues
  })

  useEffect(()=> {
    reset(query2formValues)
  }, [query2formValues, reset])

  const cleanedUpData = (values) => {
    const { since, until, probe_cc } = values
    return {
      since,
      until,
      probe_cc: probe_cc.length > 0 ? probe_cc.map(d => d.value).join(',') : undefined
    }
  }

  const [showDatePicker, setShowDatePicker] = useState(false)
  const handleRangeSelect = (range) => {
    if (range?.from) {
      setValue('since', format(range.from, 'y-MM-dd'))
    } else {
      setValue('since', '')
    }
    if (range?.to) {
      setValue('until', format(range.to, 'y-MM-dd'))
    } else {
      setValue('until', '')
    }
    setShowDatePicker(false)
    onChange(cleanedUpData(getValues()))
  }

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === 'probe_cc' && type === 'change') onChange(cleanedUpData(getValues()))
    })
    return () => subscription.unsubscribe()
  }, [watch, getValues])

  return (
    <form>
      <Flex alignItems={['center']} flexDirection={['column', 'row']}>
        <Box width={[1, 1/4]} mr={3} sx={{ zIndex: 2 }}>
          <StyledLabel>{intl.formatMessage({id: 'Search.Sidebar.Country'})}</StyledLabel>
          {<Controller
            render={({field}) => (
              <MultiSelect
                options={countryOptions}
                overrideStrings={multiSelectStrings}
                name={field.name}
                value={field.value}
                onChange={field.onChange}
              />
            )}
            name='probe_cc'
            control={control}
          />}
        </Box>
        <Box width={[1, 1/5]}>
          <Flex>
            <Box width={1/2} mr={3}>
              <StyledLabel>{intl.formatMessage({id: 'Search.Sidebar.From'})}</StyledLabel>
              <Controller
                name='since'
                control={control}
                render={({field}) => (
                  <Input
                    {...field}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Box>
            <Box width={1/2} mr={3}>
              <StyledLabel>{intl.formatMessage({id: 'Search.Sidebar.Until'})}</StyledLabel>
              <Controller
                name='until'
                control={control}
                render={({field}) => (
                  <Input
                    {...field}
                    onFocus={() => setShowDatePicker(true)}
                    onKeyDown={() => setShowDatePicker(false)}
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Box>
          </Flex>
          { showDatePicker &&
            <DateRangePicker
              handleRangeSelect={handleRangeSelect}
              initialRange={{from: getValues('since'), to: getValues('until')}}
              close={() => setShowDatePicker(false)}
            />
          }
        </Box>
      </Flex>
    </form>
  )
}

