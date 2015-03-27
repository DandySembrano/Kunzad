CREATE TABLE [dbo].[BusinessUnit]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
	[Code] VARCHAR(20) NOT NULL,
    [Name] VARCHAR(150) NOT NULL, 
    [BusinessUnitTypeId] INT NOT NULL, 
    [ParentBusinessUnitId] INT NULL, 
    [isOperatingSite] BIT NOT NULL DEFAULT 0, 
    [hasAirPort] BIT NOT NULL DEFAULT 0, 
    [hasSeaPort] BIT NOT NULL DEFAULT 0,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL 
)