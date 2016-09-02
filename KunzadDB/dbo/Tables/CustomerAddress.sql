CREATE TABLE [dbo].[CustomerAddress]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [CustomerId] INT NOT NULL, 
	[Line1] VARCHAR(150) NOT NULL, 
    [Line2] VARCHAR(150) NULL, 
    [CityMunicipalityId] INT NOT NULL, 
	[PostalCode] VARCHAR(20) NULL,
    [IsBillingAddress] BIT NOT NULL DEFAULT 0, 
    [IsDeliveryAddress] BIT NOT NULL DEFAULT 0, 
    [IsPickupAddress] BIT NOT NULL DEFAULT 0, 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_CustomerAddress_Customer] FOREIGN KEY ([CustomerId]) REFERENCES [Customer]([Id]), 
    CONSTRAINT [FK_CustomerAddress_CityMunicipality] FOREIGN KEY ([CityMunicipalityId]) REFERENCES [CityMunicipality]([Id])
)