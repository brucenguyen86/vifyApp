import {
    Card,
    Page,
    Layout,
    TextContainer,
    Image,
    Stack,
    Link,
    Text, FormLayout, Form, TextField, Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

import { trophyImage } from "../assets";

import {CompanyInforForm, ProductsCard} from "../components";
import React from "react";

export default function HomePage() {
    return (
        <Page narrowWidth>
            <TitleBar title="App name" primaryAction={null} />
            <Layout>
                <Layout.Section>
                    <Card sectioned>
                        <Stack
                            wrap={false}
                            spacing="extraTight"
                            distribution="trailing"
                            alignment="center"
                        >
                            <Stack.Item fill>
                                <TextContainer spacing="loose">
                                   I would like to write something here
                                </TextContainer>
                            </Stack.Item>
                            <Stack.Item>
                                what is a stack Item?
                            </Stack.Item>
                        </Stack>
                    </Card>
                </Layout.Section>
                <Layout.Section>

                        <Text variant="heading4xl" as="h2">
                            Enter your Company Information:
                        </Text>
                        <FormLayout>
                            <CompanyInforForm />
                        </FormLayout>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
