/*
 *
 * HomePage
 *
 */

import React, {memo} from 'react'
import {useQuery, useMutation, useQueryClient} from 'react-query'
import {getSettings, updateSettings} from '../../../../utils/api.js'

// Fields and UI
import { Main, Button, Box, Tabs } from '@strapi/design-system'
import {Formik, Form} from 'formik'
import {
  Layouts,
  Page,
  useNotification
} from '@strapi/strapi/admin'

import defaultSettings from '../../../../utils/defaults.admin.js'

// Icons
import { Check } from '@strapi/icons'

// Tab contents
import TextTabContent from './Tabs/Text'
import LayoutTabContent from './Tabs/Layout'
import EmbedsTabContent from './Tabs/Embeds'
import OtherTabContent from './Tabs/Other'
import { mergeDeep } from "../../utils/merge";

const HomePage = (ctx) => {
  const toggleNotification = useNotification()
  const queryClient = useQueryClient()
  const query = useQuery('settings', getSettings)
  const mutation = useMutation(settings => updateSettings(settings), {
    onSuccess: async () => {
      // Refresh after mutation
      await queryClient.invalidateQueries('settings')
      toggleNotification({
        type: 'success',
        message: {id: 'strapi-julius-editor-save-success', defaultMessage: 'Saved'}
      })
    },
    onError: async () => {
      toggleNotification({
        type: 'warning',
        message: {id: 'strapi-julius-editor-save-error', defaultMessage: 'Saved failed'}
      })
    }
  })

  if (query.isLoading) {
    return (
      <Main aria-busy="true">
        <Layouts.Header
          title={'Strapi Julius Editor settings'}
          subtitle={'Change how the editor should behave'}
        />
        <Layouts.Content>
          <Page.Loading />
        </Layouts.Content>
      </Main>
    )
  }

  // Merge saved settings with default values, in case new ones are added
  const mergedSettings = mergeDeep(defaultSettings, query.data)

  return (
    <Main aria-busy={query.isLoading}>
      <Formik
        initialValues={mergedSettings}
        onSubmit={async (values) => {
          await mutation.mutateAsync(values)
        }}>
        {({errors, values, handleChange, isSubmitting}) => {
          return (
            <Form>
              <Layouts.Header
                title={'Strapi Julius Editor settings'}
                subtitle={'Change how the editor should behave'}
                primaryAction={
                  <Button
                    isLoading={mutation.isLoading}
                    type="submit"
                    startIcon={<Check/>}
                    size="L"
                  >
                    Save
                  </Button>
                }
              />
              <Layouts.Content>
                <Box
                  background="neutral0"
                  hasRadius
                  shadow="filterShadow"
                  paddingTop={6}
                  paddingBottom={6}
                  paddingLeft={7}
                  paddingRight={7}
                >
                  <Tabs.Root defaultValue="text" variant="simple">
                    <Tabs.List>
                      <Tabs.Trigger value="text">Text</Tabs.Trigger>
                      <Tabs.Trigger value="layout">Layout</Tabs.Trigger>
                      <Tabs.Trigger value="embeds">Embeds</Tabs.Trigger>
                      <Tabs.Trigger value="other">Other</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="text">
                      <Box color="neutral800" padding={4} background="neutral0">
                        <TextTabContent
                          errors={errors}
                          values={values}
                          handleChange={handleChange}
                          isSubmitting={isSubmitting}
                        />
                      </Box>
                    </Tabs.Content>
                    <Tabs.Content value="layout">
                      <Box color="neutral800" padding={4} background="neutral0">
                        <LayoutTabContent
                          errors={errors}
                          values={values}
                          handleChange={handleChange}
                          isSubmitting={isSubmitting}
                        />
                      </Box>
                    </Tabs.Content>
                    <Tabs.Content value="embeds">
                      {/* Embeds tab content*/}
                      <Box color="neutral800" padding={4} background="neutral0">
                        <EmbedsTabContent
                          errors={errors}
                          values={values}
                          handleChange={handleChange}
                          isSubmitting={isSubmitting}
                        />
                      </Box>
                    </Tabs.Content>
                    <Tabs.Content value="other">
                      {/* Other tab content*/}
                      <Box color="neutral800" padding={4} background="neutral0">
                        <OtherTabContent
                          errors={errors}
                          values={values}
                          handleChange={handleChange}
                          isSubmitting={isSubmitting}
                        />
                      </Box>
                    </Tabs.Content>
                  </Tabs.Root>
                  {/* Main box end*/}
                </Box>
              </Layouts.Content>
            </Form>
          )
        }}
      </Formik>
    </Main>
  )
}

export default memo(HomePage)
