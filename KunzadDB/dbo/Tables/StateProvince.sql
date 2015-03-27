CREATE TABLE [dbo].[StateProvince]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Name] VARCHAR(150) NOT NULL, 
    [CountryId] INT NOT NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_StateProvince_Country] FOREIGN KEY ([CountryId]) REFERENCES [Country]([Id])
)