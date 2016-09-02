CREATE TABLE [dbo].[BusinessUnitContact]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [BusinessUnitId] INT NOT NULL, 
    [ContactId] INT NOT NULL,
	[CreatedDate] DATETIME NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_BusinessUnitContact_BusiessUnit] FOREIGN KEY ([BusinessUnitId]) REFERENCES [BusinessUnit]([Id]), 
    CONSTRAINT [FK_BusinessUnitContact_Contact] FOREIGN KEY ([ContactId]) REFERENCES [Contact]([Id])
)