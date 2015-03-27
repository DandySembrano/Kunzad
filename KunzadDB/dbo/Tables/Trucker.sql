CREATE TABLE [dbo].[Trucker]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Name] VARCHAR(150) NOT NULL, 
    [TIN] VARCHAR(50) NULL, 
    [AddressId] INT NOT NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL 
)