CREATE TABLE [dbo].[User]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY, 
    [LoginName] VARCHAR(50) NOT NULL, 
    [FirstName] VARCHAR(50) NOT NULL, 
    [MiddleName] VARCHAR(50) NULL, 
    [LastName] VARCHAR(50) NOT NULL, 
    [Email] VARCHAR(150) NOT NULL,
	[CreatedDate] DATETIME NOT NULL, 
    [LastUpdatedDate] DATETIME NULL, 
    [CreatedByUserId] INT NOT NULL, 
    [LastUpdatedByUserId] INT NULL, 
    CONSTRAINT [FK_User_User_Created] FOREIGN KEY ([CreatedByUserId]) REFERENCES [User]([Id]),
	CONSTRAINT [FK_User_User_Updated] FOREIGN KEY ([LastUpdatedByUserId]) REFERENCES [User]([Id])  
)