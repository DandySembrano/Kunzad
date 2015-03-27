CREATE TABLE [dbo].[Country]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Code] VARCHAR(10) NOT NULL, 
    [Name] VARCHAR(150) NOT NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL 
)