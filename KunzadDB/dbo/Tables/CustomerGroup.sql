CREATE TABLE [dbo].[CustomerGroup]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(150) NOT NULL,
	[Remarks] VARCHAR(MAX) NULL, 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL
)