
/*Markup for small screen sizes ( mobile) */
import {
    IndexTable, LegacyStack,
    Thumbnail,
    UnstyledLink,
} from "@shopify/polaris";
import {ImageMajor} from "@shopify/polaris-icons";
// UseMedia to support multiple screen sizes
import {useMedia} from "@shopify/react-hooks";
// dayjs is used to capture and formate the date a invoice was created or modified
import dayjs from "dayjs";
import {useNavigate} from "@shopify/app-bridge-react";


function SmallScreenCard ({
                              id,
                              title,
                                product,
                              createdAt,
                              navigate,

                          }) {
    return (
        <UnstyledLink onClick = {() => navigate(`/products/${id}`)}  >
            <div
                style = {{padding: "0.75rem 1rem",borderBottom: "1px solid #E1E3E5"}} >

            </div>
            <LegacyStack>
                <LegacyStack.Item>
                    <Thumbnail source={product?.images?.edges[0]?.node?.url || ImageMajor}
                               alt={"placeholder"}
                               color = "base"
                               size = "small" />

                </LegacyStack.Item>
                <LegacyStack.Item fill>
                    <LegacyStack vertical={true}>
                        <LegacyStack.Item>
                            <p>
                                    {truncate(title,35)}
                            </p>
                            <p>{truncate(product?.title,35)}</p>
                            <p>{dayjs(createdAt).format("MMMM D,YYYY")}</p>
                        </LegacyStack.Item>

                    </LegacyStack>
                </LegacyStack.Item>

            </LegacyStack>
        </UnstyledLink>
    )
}

export function InvoiceIndex({products,loading}){
    const navigate = useNavigate();
    // Check if screen is small
    const isSmallScreen = useMedia("(max-width: 640px)");
    // Map over products for small screen
    const smallScreenMarkup = products.map((product) => (
        <SmallScreenCard key={product.id} navigate={navigate} {...product} />
    ));

    const resourceName = {
        singular: "product",
        plural: "products",
    };

    const rowMarkup = products.map(
        ({ id, title, createdAt,images }, index) => {

            /* The form layout, created using Polaris components. Includes the QR code data set above. */
            return (
                <IndexTable.Row
                    id={id}
                    key={id}
                    position={index}
                    onClick={() => {
                        navigate(`/products/${id}`);
                    }}
                >
                    <IndexTable.Cell>
                        <Thumbnail
                            source={images?.edges[0]?.node?.url || ImageMajor}
                            alt="placeholder"
                            color="base"
                            size="small"
                        />
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <UnstyledLink data-primary-link url={`/products/${id}`}>
                            {truncate(title, 25)}
                        </UnstyledLink>
                    </IndexTable.Cell>

                </IndexTable.Row>
            );
        }
    );

    /* A layout for small screens, built using Polaris components */
    return (
        <LegacyStack>
            {isSmallScreen ? (
                smallScreenMarkup
            ) : (
                <IndexTable
                    resourceName={resourceName}
                    itemCount={products.length}
                    headings={[
                        { title: "Thumbnail", hidden: true },
                        { title: "Title" },
                        { title: "Customer" },
                        { title: "Date created" },

                    ]}
                    selectable={false}
                    loading={loading}
                >
                    {rowMarkup}
                </IndexTable>
            )}
        </LegacyStack>
    );
}

/* A function to truncate long strings */
function truncate(str, n) {
    return str.length > n ? str.substr(0, n - 1) + "…" : str;
}

