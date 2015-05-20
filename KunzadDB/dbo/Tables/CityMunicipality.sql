CREATE TABLE [dbo].[CityMunicipality]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(150) NOT NULL, 
    [StateProvinceId] INT NOT NULL, 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL 
    CONSTRAINT [FK_CityTown_StateProvince] FOREIGN KEY ([StateProvinceId]) REFERENCES [StateProvince]([Id])
)