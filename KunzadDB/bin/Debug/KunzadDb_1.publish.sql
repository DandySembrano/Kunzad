﻿/*
Deployment script for KunzadDb

This code was generated by a tool.
Changes to this file may cause incorrect behavior and will be lost if
the code is regenerated.
*/

GO
SET ANSI_NULLS, ANSI_PADDING, ANSI_WARNINGS, ARITHABORT, CONCAT_NULL_YIELDS_NULL, QUOTED_IDENTIFIER ON;

SET NUMERIC_ROUNDABORT OFF;


GO
:setvar DatabaseName "KunzadDb"
:setvar DefaultFilePrefix "KunzadDb"
:setvar DefaultDataPath "C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\"
:setvar DefaultLogPath "C:\Program Files\Microsoft SQL Server\MSSQL10_50.MSSQLSERVER\MSSQL\DATA\"

GO
:on error exit
GO
/*
Detect SQLCMD mode and disable script execution if SQLCMD mode is not supported.
To re-enable the script after enabling SQLCMD mode, execute the following:
SET NOEXEC OFF; 
*/
:setvar __IsSqlCmdEnabled "True"
GO
IF N'$(__IsSqlCmdEnabled)' NOT LIKE N'True'
    BEGIN
        PRINT N'SQLCMD mode must be enabled to successfully execute this script.';
        SET NOEXEC ON;
    END


GO
USE [$(DatabaseName)];


GO
PRINT N'Dropping DF__Shipment__Quanti__1E05700A...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__Quanti__1E05700A];


GO
PRINT N'Dropping DF__Shipment__TotalC__1EF99443...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__TotalC__1EF99443];


GO
PRINT N'Dropping DF__Shipment__IsReve__1FEDB87C...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__IsReve__1FEDB87C];


GO
PRINT N'Dropping DF__Shipment__Revenu__20E1DCB5...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__Revenu__20E1DCB5];


GO
PRINT N'Dropping DF__Shipment__IsTaxI__21D600EE...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__IsTaxI__21D600EE];


GO
PRINT N'Dropping DF__Shipment__TaxAmo__22CA2527...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__TaxAmo__22CA2527];


GO
PRINT N'Dropping DF__Shipment__TaxPer__23BE4960...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__TaxPer__23BE4960];


GO
PRINT N'Dropping DF__Shipment__Parent__24B26D99...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__Parent__24B26D99];


GO
PRINT N'Dropping DF__Shipment__IsCons__25A691D2...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__IsCons__25A691D2];


GO
PRINT N'Dropping DF__Shipment__IsMult__269AB60B...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [DF__Shipment__IsMult__269AB60B];


GO
PRINT N'Dropping FK_CourierTransactionDetails_Shipment...';


GO
ALTER TABLE [dbo].[CourierTransactionDetails] DROP CONSTRAINT [FK_CourierTransactionDetails_Shipment];


GO
PRINT N'Dropping FK_SeaFreightShipment_Shipment...';


GO
ALTER TABLE [dbo].[SeaFreightShipment] DROP CONSTRAINT [FK_SeaFreightShipment_Shipment];


GO
PRINT N'Dropping FK_Shipment_BusinessUnit...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [FK_Shipment_BusinessUnit];


GO
PRINT N'Dropping FK_Shipment_Service...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [FK_Shipment_Service];


GO
PRINT N'Dropping FK_Shipment_ShipmentType...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [FK_Shipment_ShipmentType];


GO
PRINT N'Dropping FK_Shipment_Customer...';


GO
ALTER TABLE [dbo].[Shipment] DROP CONSTRAINT [FK_Shipment_Customer];


GO
PRINT N'Dropping FK_ShipmentCharges_Shipment...';


GO
ALTER TABLE [dbo].[ShipmentCharges] DROP CONSTRAINT [FK_ShipmentCharges_Shipment];


GO
PRINT N'Dropping FK_ShipmentDimension_Shipment...';


GO
ALTER TABLE [dbo].[ShipmentDimension] DROP CONSTRAINT [FK_ShipmentDimension_Shipment];


GO
PRINT N'Dropping FK_AirFreightShipment_Shipment...';


GO
ALTER TABLE [dbo].[AirFreightShipment] DROP CONSTRAINT [FK_AirFreightShipment_Shipment];


GO
PRINT N'Dropping FK_TruckingDelivery_Shipment...';


GO
ALTER TABLE [dbo].[TruckingDelivery] DROP CONSTRAINT [FK_TruckingDelivery_Shipment];


GO
PRINT N'Starting rebuilding table [dbo].[Shipment]...';


GO
BEGIN TRANSACTION;

SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SET XACT_ABORT ON;

CREATE TABLE [dbo].[tmp_ms_xx_Shipment] (
    [Id]                  INT             IDENTITY (1, 1) NOT NULL,
    [BusinessUnitId]      INT             NOT NULL,
    [ServiceId]           INT             NOT NULL,
    [ShipmentTypeId]      INT             NOT NULL,
    [PaymentMode]         CHAR (1)        NOT NULL,
    [CustomerId]          INT             NOT NULL,
    [BillToCustomerId]    INT             NULL,
    [Quantity]            SMALLINT        DEFAULT 0 NOT NULL,
    [TotalCBM]            DECIMAL (18, 6) DEFAULT 0 NOT NULL,
    [IsRevenue]           BIT             DEFAULT 0 NOT NULL,
    [Revenue]             MONEY           DEFAULT 0 NOT NULL,
    [IsTaxInclusive]      BIT             DEFAULT 0 NOT NULL,
    [TaxAmount]           MONEY           DEFAULT 0 NOT NULL,
    [TaxPercentage]       DECIMAL (5, 2)  DEFAULT 0 NOT NULL,
    [Description]         TEXT            NOT NULL,
    [DeliverTo]           VARCHAR (150)   NOT NULL,
    [DeliveryAddressId]   INT             NOT NULL,
    [DeliveryDate]        DATETIME        NULL,
    [DeliveryTime]        TIME (7)        NULL,
    [ReceivedByName]      VARCHAR (150)   NULL,
    [TargetPickupDate]    DATE            NULL,
    [TargetPickupTime]    TIME (7)        NULL,
    [DeliverToContactNo]  TEXT            NULL,
    [OriginAddressId]     INT             NULL,
    [ParentShipmentId]    INT             DEFAULT 0 NOT NULL,
    [IsConsolidation]     BIT             DEFAULT 0 NOT NULL,
    [IsMultipleDelivery]  BIT             DEFAULT 0 NOT NULL,
    [CreatedDate]         DATETIME        NULL,
    [LastUpdatedDate]     DATETIME        NULL,
    [CreatedByUserId]     INT             NULL,
    [LastUpdatedByUserId] INT             NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC)
);

IF EXISTS (SELECT TOP 1 1 
           FROM   [dbo].[Shipment])
    BEGIN
        SET IDENTITY_INSERT [dbo].[tmp_ms_xx_Shipment] ON;
        INSERT INTO [dbo].[tmp_ms_xx_Shipment] ([Id], [BusinessUnitId], [ServiceId], [ShipmentTypeId], [PaymentMode], [CustomerId], [BillToCustomerId], [Quantity], [TotalCBM], [IsRevenue], [Revenue], [IsTaxInclusive], [TaxAmount], [TaxPercentage], [Description], [DeliverTo], [DeliveryAddressId], [DeliveryDate], [DeliveryTime], [ReceivedByName], [ParentShipmentId], [IsConsolidation], [IsMultipleDelivery], [CreatedDate], [LastUpdatedDate], [CreatedByUserId], [LastUpdatedByUserId])
        SELECT   [Id],
                 [BusinessUnitId],
                 [ServiceId],
                 [ShipmentTypeId],
                 [PaymentMode],
                 [CustomerId],
                 [BillToCustomerId],
                 [Quantity],
                 [TotalCBM],
                 [IsRevenue],
                 [Revenue],
                 [IsTaxInclusive],
                 [TaxAmount],
                 [TaxPercentage],
                 [Description],
                 [DeliverTo],
                 [DeliveryAddressId],
                 [DeliveryDate],
                 [DeliveryTime],
                 [ReceivedByName],
                 [ParentShipmentId],
                 [IsConsolidation],
                 [IsMultipleDelivery],
                 [CreatedDate],
                 [LastUpdatedDate],
                 [CreatedByUserId],
                 [LastUpdatedByUserId]
        FROM     [dbo].[Shipment]
        ORDER BY [Id] ASC;
        SET IDENTITY_INSERT [dbo].[tmp_ms_xx_Shipment] OFF;
    END

DROP TABLE [dbo].[Shipment];

EXECUTE sp_rename N'[dbo].[tmp_ms_xx_Shipment]', N'Shipment';

COMMIT TRANSACTION;

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;


GO
PRINT N'Creating FK_CourierTransactionDetails_Shipment...';


GO
ALTER TABLE [dbo].[CourierTransactionDetails] WITH NOCHECK
    ADD CONSTRAINT [FK_CourierTransactionDetails_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [dbo].[Shipment] ([Id]);


GO
PRINT N'Creating FK_SeaFreightShipment_Shipment...';


GO
ALTER TABLE [dbo].[SeaFreightShipment] WITH NOCHECK
    ADD CONSTRAINT [FK_SeaFreightShipment_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [dbo].[Shipment] ([Id]);


GO
PRINT N'Creating FK_Shipment_BusinessUnit...';


GO
ALTER TABLE [dbo].[Shipment] WITH NOCHECK
    ADD CONSTRAINT [FK_Shipment_BusinessUnit] FOREIGN KEY ([BusinessUnitId]) REFERENCES [dbo].[BusinessUnit] ([Id]);


GO
PRINT N'Creating FK_Shipment_Service...';


GO
ALTER TABLE [dbo].[Shipment] WITH NOCHECK
    ADD CONSTRAINT [FK_Shipment_Service] FOREIGN KEY ([ServiceId]) REFERENCES [dbo].[Service] ([Id]);


GO
PRINT N'Creating FK_Shipment_ShipmentType...';


GO
ALTER TABLE [dbo].[Shipment] WITH NOCHECK
    ADD CONSTRAINT [FK_Shipment_ShipmentType] FOREIGN KEY ([ShipmentTypeId]) REFERENCES [dbo].[ShipmentType] ([Id]);


GO
PRINT N'Creating FK_Shipment_Customer...';


GO
ALTER TABLE [dbo].[Shipment] WITH NOCHECK
    ADD CONSTRAINT [FK_Shipment_Customer] FOREIGN KEY ([CustomerId]) REFERENCES [dbo].[Customer] ([Id]);


GO
PRINT N'Creating FK_ShipmentCharges_Shipment...';


GO
ALTER TABLE [dbo].[ShipmentCharges] WITH NOCHECK
    ADD CONSTRAINT [FK_ShipmentCharges_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [dbo].[Shipment] ([Id]);


GO
PRINT N'Creating FK_ShipmentDimension_Shipment...';


GO
ALTER TABLE [dbo].[ShipmentDimension] WITH NOCHECK
    ADD CONSTRAINT [FK_ShipmentDimension_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [dbo].[Shipment] ([Id]);


GO
PRINT N'Creating FK_AirFreightShipment_Shipment...';


GO
ALTER TABLE [dbo].[AirFreightShipment] WITH NOCHECK
    ADD CONSTRAINT [FK_AirFreightShipment_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [dbo].[Shipment] ([Id]);


GO
PRINT N'Creating FK_TruckingDelivery_Shipment...';


GO
ALTER TABLE [dbo].[TruckingDelivery] WITH NOCHECK
    ADD CONSTRAINT [FK_TruckingDelivery_Shipment] FOREIGN KEY ([ShipmentId]) REFERENCES [dbo].[Shipment] ([Id]);


GO
PRINT N'Checking existing data against newly created constraints';


GO
USE [$(DatabaseName)];


GO
ALTER TABLE [dbo].[CourierTransactionDetails] WITH CHECK CHECK CONSTRAINT [FK_CourierTransactionDetails_Shipment];

ALTER TABLE [dbo].[SeaFreightShipment] WITH CHECK CHECK CONSTRAINT [FK_SeaFreightShipment_Shipment];

ALTER TABLE [dbo].[Shipment] WITH CHECK CHECK CONSTRAINT [FK_Shipment_BusinessUnit];

ALTER TABLE [dbo].[Shipment] WITH CHECK CHECK CONSTRAINT [FK_Shipment_Service];

ALTER TABLE [dbo].[Shipment] WITH CHECK CHECK CONSTRAINT [FK_Shipment_ShipmentType];

ALTER TABLE [dbo].[Shipment] WITH CHECK CHECK CONSTRAINT [FK_Shipment_Customer];

ALTER TABLE [dbo].[ShipmentCharges] WITH CHECK CHECK CONSTRAINT [FK_ShipmentCharges_Shipment];

ALTER TABLE [dbo].[ShipmentDimension] WITH CHECK CHECK CONSTRAINT [FK_ShipmentDimension_Shipment];

ALTER TABLE [dbo].[AirFreightShipment] WITH CHECK CHECK CONSTRAINT [FK_AirFreightShipment_Shipment];

ALTER TABLE [dbo].[TruckingDelivery] WITH CHECK CHECK CONSTRAINT [FK_TruckingDelivery_Shipment];


GO
PRINT N'Update complete.';


GO
