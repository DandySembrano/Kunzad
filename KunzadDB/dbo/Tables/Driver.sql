CREATE TABLE [dbo].[Driver]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [FirstName] VARCHAR(150) NOT NULL, 
    [MiddleName] VARCHAR(150) NULL, 
    [LastName] VARCHAR(150) NOT NULL, 
    [LicenseNo] VARCHAR(50) NULL, 
    [LicenseExpiry] DATETIME NULL
)