CREATE TABLE [dbo].[Trucker]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(150) NOT NULL, 
    [TIN] VARCHAR(50) NULL, 
    [AddressId] INT NOT NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_Trucker_Address] FOREIGN KEY ([AddressId]) REFERENCES [Address]([Id]) 
)