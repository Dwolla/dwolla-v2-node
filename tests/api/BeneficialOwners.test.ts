import nock from "nock";
import {
    BeneficialOwner,
    Client,
    Country,
    CreateBeneficialOwnerBody,
    DateOfBirth,
    UpdateBeneficialOwnerBody,
    USState
} from "../../src";
import { PATHS } from "../../src/constants";
import { Token } from "../../src/Token";
import { getApiHeaders, getClient, mockTokenRequest } from "../utils";

describe("Beneficial Owners API", () => {
    const client: Client = getClient();
    const id = "12344567890";
    let token: Token;

    beforeEach(async () => {
        mockTokenRequest(client);
        token = await client.auth.requestToken();
    });

    test("should create beneficial owner for customer", async () => {
        const requestBody: CreateBeneficialOwnerBody = {
            firstName: "Beneficial",
            lastName: "Owner",
            ssn: "123-45-6789",
            dateOfBirth: new DateOfBirth(2000, 1, 1),
            address: {
                address1: "123 Main Street",
                address2: "Building 2",
                address3: "Unit 101",
                city: "Denver",
                stateProvinceRegion: USState.COLOLRADO,
                country: Country.UNITED_STATES,
                postalCode: "80239"
            }
        };

        const responseBody = {
            id: "123",
            ...requestBody,
            verificationStatus: "verified",
            created: "2022-06-01T00:00:00.000Z"
        };

        nock([client.environment.apiUrl, PATHS.CUSTOMERS, id, PATHS.BENEFICIAL_OWNERS].join("/"), {
            reqheaders: getApiHeaders(token)
        })
            .post("")
            .reply(200, responseBody);

        const response = await client.api.beneficialOwners.createForCustomer(id, requestBody);
        expectSingleBeneficialOwner(response, responseBody);
    });

    test("should get single beneficial owner", async () => {
        const responseBody = {
            id: "123",
            firstName: "Beneficial",
            lastName: "Owner",
            address: {
                address1: "123 Main Street",
                address2: "Building 2",
                address3: "Unit 101",
                city: "Denver",
                stateProvinceRegion: USState.COLOLRADO,
                country: Country.UNITED_STATES,
                postalCode: "80239"
            },
            verificationStatus: "verified",
            created: "2022-06-01T00:00:00.000Z"
        };

        nock([client.environment.apiUrl, PATHS.BENEFICIAL_OWNERS, id].join("/"), {
            reqheaders: getApiHeaders(token)
        })
            .get("")
            .reply(200, responseBody);

        const response = await client.api.beneficialOwners.get(id);
        expectSingleBeneficialOwner(response, responseBody);
    });

    test("should list beneficial owners for customer", async () => {
        const responseBody = {
            _embedded: {
                "beneficial-owners": [
                    {
                        id: "123",
                        firstName: "Beneficial",
                        lastName: "Owner",
                        address: {
                            address1: "123 Main Street",
                            address2: "Building 2",
                            address3: "Unit 101",
                            city: "Denver",
                            stateProvinceRegion: USState.COLOLRADO,
                            country: Country.UNITED_STATES,
                            postalCode: "80239"
                        },
                        verificationStatus: "verified",
                        created: "2022-06-01T00:00:00.000Z"
                    }
                ]
            },
            total: 1
        };

        nock([client.environment.apiUrl, PATHS.CUSTOMERS, id, PATHS.BENEFICIAL_OWNERS].join("/"), {
            reqheaders: getApiHeaders(token)
        })
            .get("")
            .reply(200, responseBody);

        const response = await client.api.beneficialOwners.listForCustomer(id);

        expect(response).toEqual(
            expect.objectContaining({
                _embedded: expect.objectContaining({
                    "beneficial-owners": expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            firstName: responseBody._embedded["beneficial-owners"][0].firstName,
                            lastName: responseBody._embedded["beneficial-owners"][0].lastName,
                            address: expect.objectContaining({
                                address1: responseBody._embedded["beneficial-owners"][0].address.address1,
                                address2: responseBody._embedded["beneficial-owners"][0].address.address2,
                                address3: responseBody._embedded["beneficial-owners"][0].address.address3,
                                city: responseBody._embedded["beneficial-owners"][0].address.city,
                                stateProvinceRegion:
                                    responseBody._embedded["beneficial-owners"][0].address.stateProvinceRegion,
                                postalCode: responseBody._embedded["beneficial-owners"][0].address.postalCode
                            }),
                            verificationStatus: expect.any(String),
                            created: expect.any(Date)
                        })
                    ])
                }),
                total: responseBody.total
            })
        );
    });

    test("should remove beneficial owner", async () => {
        const responseBody = {
            id: "123",
            firstName: "Beneficial",
            lastName: "Owner",
            address: {
                address1: "123 Main Street",
                address2: "Building 2",
                address3: "Unit 101",
                city: "Denver",
                stateProvinceRegion: USState.COLOLRADO,
                country: Country.UNITED_STATES,
                postalCode: "80239"
            },
            verificationStatus: "verified",
            created: "2022-06-01T00:00:00.000Z"
        };

        nock([client.environment.apiUrl, PATHS.BENEFICIAL_OWNERS, id].join("/"), { reqheaders: getApiHeaders(token) })
            .delete("")
            .reply(200, responseBody);

        const response = await client.api.beneficialOwners.remove(id);
        expectSingleBeneficialOwner(response, responseBody);
    });

    test("should update beneficial owner", async () => {
        const requestBody: UpdateBeneficialOwnerBody = {
            firstName: "beneficial",
            lastName: "owner",
            ssn: "123-54-6789",
            dateOfBirth: new DateOfBirth(2000, 1, 1),
            address: {
                address1: "123 Updated Address Street",
                address2: "Floor 18",
                address3: "Apt 008",
                city: "Los Angeles",
                stateProvinceRegion: USState.CALIFORNIA,
                country: Country.UNITED_STATES,
                postalCode: "90048"
            }
        };

        const responseBody = {
            id: "123",
            ...requestBody,
            verificationStatus: "verified",
            created: "2022-06-01T00:00:00.000Z"
        };

        nock([client.environment.apiUrl, PATHS.BENEFICIAL_OWNERS, id].join("/"), { reqheaders: getApiHeaders(token) })
            .post("")
            .reply(200, responseBody);

        const response = await client.api.beneficialOwners.update(id, requestBody);
        expectSingleBeneficialOwner(response, responseBody);
    });

    afterEach(() => {
        nock.cleanAll();
    });
});

function expectSingleBeneficialOwner(response: BeneficialOwner, shouldBe: any): void {
    expect(response).toEqual(
        expect.objectContaining({
            id: expect.any(String),
            firstName: shouldBe.firstName,
            lastName: shouldBe.lastName,
            address: expect.objectContaining({
                address1: shouldBe.address.address1,
                address2: shouldBe.address.address2,
                address3: shouldBe.address.address3,
                city: shouldBe.address.city,
                stateProvinceRegion: shouldBe.address.stateProvinceRegion,
                postalCode: shouldBe.address.postalCode
            }),
            verificationStatus: expect.any(String),
            created: expect.any(Date)
        })
    );
}
