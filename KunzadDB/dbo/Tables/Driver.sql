CREATE TABLE [dbo].[Driver]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [FirstName] VARCHAR(150) NOT NULL, 
    [MiddleName] VARCHAR(150) NULL, 
    [LastName] VARCHAR(150) NOT NULL, 
    [LicenseNo] VARCHAR(50) NULL, 
    [LicenseExpiry] DATETIME NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL 
)