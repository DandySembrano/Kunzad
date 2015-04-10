CREATE TABLE [dbo].[Address]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Line1] VARCHAR(150) NOT NULL, 
    [LIne2] VARCHAR(150) NULL, 
    [LIne3] VARCHAR(150) NULL, 
    [CityMunicipalityId] INT NOT NULL, 
	[PostalCode] VARCHAR(20) NULL,
    [OtherAddressDetails] VARCHAR(200) NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_Address_CityMunicipality] FOREIGN KEY ([CityMunicipalityId]) REFERENCES [CityMunicipality]([Id]),
)