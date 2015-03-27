CREATE TABLE [dbo].[ContactPhone]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [ContactId] INT NOT NULL, 
    [ContactNumber] VARCHAR(20) NOT NULL, 
    [ContactNumberTypeId] INT NOT NULL, 
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_ContactPhone_Contact] FOREIGN KEY ([ContactId]) REFERENCES [Contact]([Id]), 
    CONSTRAINT [FK_ContactPhone_ContactNumberType] FOREIGN KEY ([ContactNumberTypeId]) REFERENCES [ContactNumberType]([Id])
)