CREATE TABLE [dbo].[Trucker]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(150) NOT NULL, 
    [TIN] VARCHAR(50) NULL,  
    [Line1] VARCHAR(150) NULL, 
    [Line2] VARCHAR(150) NULL, 
    [CityMunicipalityId] INT NULL, 
    [PostalCode] VARCHAR(20) NULL , 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL,
    CONSTRAINT [FK_CityMunicipality_Trucker] FOREIGN KEY ([CityMunicipalityId]) REFERENCES [CityMunicipality]([Id]), 
)