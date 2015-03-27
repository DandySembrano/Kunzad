CREATE TABLE [dbo].[ServiceableArea]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(150) NOT NULL,
	[CityMunicipalityId] INT NOT NULL, 
	[PostalCode] VARCHAR(20) NOT NULL,
    [IsServiceable] BIT NOT NULL DEFAULT 0, 
    [BusinessUnitId] INT NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_ServiceableArea_CityMunicipality] FOREIGN KEY ([CityMunicipalityId]) REFERENCES [CityMunicipality]([Id]) 
)