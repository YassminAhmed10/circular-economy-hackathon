-- ECOv Factory Registration Database Schema
-- SQL Server Database

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ECoVFactoryDB')
BEGIN
    CREATE DATABASE ECoVFactoryDB;
END
GO

USE ECoVFactoryDB;
GO

-- =============================================
-- Table: Factories
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Factories')
BEGIN
    CREATE TABLE Factories (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        FactoryName NVARCHAR(255) NOT NULL,
        IndustryType NVARCHAR(100) NOT NULL,
        Location NVARCHAR(100) NOT NULL,
        Address NVARCHAR(MAX) NOT NULL,
        Phone NVARCHAR(20) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        OwnerName NVARCHAR(255) NOT NULL,
        OwnerPhone NVARCHAR(20),
        TaxNumber NVARCHAR(50) NOT NULL UNIQUE,
        RegistrationNumber NVARCHAR(50) NOT NULL UNIQUE,
        EstablishmentYear INT,
        NumberOfEmployees INT,
        FactorySize DECIMAL(10, 2),
        Website NVARCHAR(255),
        LogoUrl NVARCHAR(MAX),
        Verified BIT DEFAULT 0,
        Status NVARCHAR(20) DEFAULT 'pending' CHECK (Status IN ('pending', 'approved', 'rejected', 'suspended')),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        
        INDEX IX_Email (Email),
        INDEX IX_TaxNumber (TaxNumber),
        INDEX IX_Status (Status),
        INDEX IX_Location (Location),
        INDEX IX_CreatedAt (CreatedAt)
    );
END
GO

-- =============================================
-- Table: WasteTypesRef (Reference/Lookup Table)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'WasteTypesRef')
BEGIN
    CREATE TABLE WasteTypesRef (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        WasteCode NVARCHAR(20) NOT NULL UNIQUE,
        WasteNameAr NVARCHAR(100) NOT NULL,
        WasteNameEn NVARCHAR(100) NOT NULL,
        Description NVARCHAR(MAX),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        
        INDEX IX_WasteCode (WasteCode)
    );
END
GO

-- =============================================
-- Table: FactoryWasteTypes (Many-to-Many)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'FactoryWasteTypes')
BEGIN
    CREATE TABLE FactoryWasteTypes (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        FactoryId BIGINT NOT NULL,
        WasteCode NVARCHAR(20) NOT NULL,
        WasteAmount DECIMAL(10, 2) NOT NULL,
        WasteUnit NVARCHAR(20) NOT NULL CHECK (WasteUnit IN ('kg', 'ton', 'liter', 'cubic')),
        Frequency NVARCHAR(20) NOT NULL CHECK (Frequency IN ('daily', 'weekly', 'monthly', 'seasonal', 'continuous')),
        Description NVARCHAR(MAX),
        IsActive BIT DEFAULT 1,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        
        FOREIGN KEY (FactoryId) REFERENCES Factories(Id) ON DELETE CASCADE,
        FOREIGN KEY (WasteCode) REFERENCES WasteTypesRef(WasteCode),
        INDEX IX_FactoryId (FactoryId),
        INDEX IX_WasteCode (WasteCode),
        INDEX IX_IsActive (IsActive)
    );
END
GO

-- =============================================
-- Table: Users (for authentication)
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        FactoryId BIGINT,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        Salt NVARCHAR(MAX) NOT NULL,
        FullName NVARCHAR(255) NOT NULL,
        Role NVARCHAR(50) DEFAULT 'factory_owner' CHECK (Role IN ('factory_owner', 'admin', 'moderator')),
        IsActive BIT DEFAULT 1,
        LastLogin DATETIME2,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        UpdatedAt DATETIME2 DEFAULT GETDATE(),
        
        FOREIGN KEY (FactoryId) REFERENCES Factories(Id) ON DELETE SET NULL,
        INDEX IX_Email (Email),
        INDEX IX_FactoryId (FactoryId),
        INDEX IX_Role (Role)
    );
END
GO

-- =============================================
-- Table: VerificationTokens
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'VerificationTokens')
BEGIN
    CREATE TABLE VerificationTokens (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        FactoryId BIGINT NOT NULL,
        Token NVARCHAR(MAX) NOT NULL,
        TokenType NVARCHAR(50) NOT NULL CHECK (TokenType IN ('email_verification', 'password_reset')),
        ExpiresAt DATETIME2 NOT NULL,
        IsUsed BIT DEFAULT 0,
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        
        FOREIGN KEY (FactoryId) REFERENCES Factories(Id) ON DELETE CASCADE,
        INDEX IX_FactoryId (FactoryId),
        INDEX IX_TokenType (TokenType),
        INDEX IX_ExpiresAt (ExpiresAt)
    );
END
GO

-- =============================================
-- Table: AuditLogs
-- =============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLogs')
BEGIN
    CREATE TABLE AuditLogs (
        Id BIGINT IDENTITY(1,1) PRIMARY KEY,
        UserId BIGINT,
        FactoryId BIGINT,
        Action NVARCHAR(100) NOT NULL,
        EntityType NVARCHAR(50),
        EntityId BIGINT,
        OldValues NVARCHAR(MAX),
        NewValues NVARCHAR(MAX),
        IpAddress NVARCHAR(50),
        UserAgent NVARCHAR(MAX),
        CreatedAt DATETIME2 DEFAULT GETDATE(),
        
        FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE SET NULL,
        FOREIGN KEY (FactoryId) REFERENCES Factories(Id) ON DELETE SET NULL,
        INDEX IX_UserId (UserId),
        INDEX IX_FactoryId (FactoryId),
        INDEX IX_Action (Action),
        INDEX IX_CreatedAt (CreatedAt)
    );
END
GO

-- =============================================
-- Insert Initial Waste Types Reference Data
-- =============================================
IF NOT EXISTS (SELECT * FROM WasteTypesRef)
BEGIN
    INSERT INTO WasteTypesRef (WasteCode, WasteNameAr, WasteNameEn, Description)
    VALUES
        ('organic', N'نفايات عضوية', 'Organic Waste', N'نفايات قابلة للتحلل من مصادر نباتية وحيوانية'),
        ('plastic', N'بلاستيك', 'Plastic', N'مواد بلاستيكية من مختلف الأنواع'),
        ('metal', N'معادن', 'Metal', N'نفايات معدنية وخردة معادن'),
        ('paper', N'ورق وكرتون', 'Paper & Cardboard', N'ورق، كرتون، ومنتجات ورقية'),
        ('glass', N'زجاج', 'Glass', N'زجاج ومنتجات زجاجية'),
        ('electronic', N'إلكترونيات', 'Electronics', N'نفايات إلكترونية ومعدات كهربائية'),
        ('chemical', N'نفايات كيميائية', 'Chemical Waste', N'مواد كيميائية ونفايات خطرة'),
        ('textile', N'نفايات نسيج', 'Textile Waste', N'أقمشة ومنتجات نسيجية'),
        ('wood', N'أخشاب', 'Wood', N'أخشاب ومنتجات خشبية'),
        ('oil', N'زيوت مستعملة', 'Used Oil', N'زيوت مستعملة وسوائل بترولية');
END
GO

-- =============================================
-- Stored Procedure: RegisterFactory
-- =============================================
CREATE OR ALTER PROCEDURE sp_RegisterFactory
    @FactoryName NVARCHAR(255),
    @IndustryType NVARCHAR(100),
    @Location NVARCHAR(100),
    @Address NVARCHAR(MAX),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(255),
    @OwnerName NVARCHAR(255),
    @OwnerPhone NVARCHAR(20),
    @TaxNumber NVARCHAR(50),
    @RegistrationNumber NVARCHAR(50),
    @EstablishmentYear INT = NULL,
    @NumberOfEmployees INT = NULL,
    @FactorySize DECIMAL(10, 2) = NULL,
    @Website NVARCHAR(255) = NULL,
    @LogoUrl NVARCHAR(MAX) = NULL,
    @FactoryId BIGINT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Check if email already exists
        IF EXISTS (SELECT 1 FROM Factories WHERE Email = @Email)
        BEGIN
            RAISERROR('البريد الإلكتروني مسجل بالفعل', 16, 1);
            RETURN;
        END
        
        -- Check if tax number already exists
        IF EXISTS (SELECT 1 FROM Factories WHERE TaxNumber = @TaxNumber)
        BEGIN
            RAISERROR('الرقم الضريبي مسجل بالفعل', 16, 1);
            RETURN;
        END
        
        -- Check if registration number already exists
        IF EXISTS (SELECT 1 FROM Factories WHERE RegistrationNumber = @RegistrationNumber)
        BEGIN
            RAISERROR('رقم السجل التجاري مسجل بالفعل', 16, 1);
            RETURN;
        END
        
        -- Insert factory
        INSERT INTO Factories (
            FactoryName, IndustryType, Location, Address, Phone, Email,
            OwnerName, OwnerPhone, TaxNumber, RegistrationNumber,
            EstablishmentYear, NumberOfEmployees, FactorySize, Website, LogoUrl
        )
        VALUES (
            @FactoryName, @IndustryType, @Location, @Address, @Phone, @Email,
            @OwnerName, @OwnerPhone, @TaxNumber, @RegistrationNumber,
            @EstablishmentYear, @NumberOfEmployees, @FactorySize, @Website, @LogoUrl
        );
        
        SET @FactoryId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
        
        SELECT @FactoryId AS FactoryId, 'تم تسجيل المصنع بنجاح' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        THROW;
    END CATCH
END
GO

-- =============================================
-- Stored Procedure: AddFactoryWasteTypes
-- =============================================
CREATE OR ALTER PROCEDURE sp_AddFactoryWasteTypes
    @FactoryId BIGINT,
    @WastesJson NVARCHAR(MAX) -- JSON array of waste types
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        -- Parse JSON and insert waste types
        INSERT INTO FactoryWasteTypes (FactoryId, WasteCode, WasteAmount, WasteUnit, Frequency, Description)
        SELECT 
            @FactoryId,
            JSON_VALUE(value, '$.wasteCode'),
            CAST(JSON_VALUE(value, '$.amount') AS DECIMAL(10,2)),
            JSON_VALUE(value, '$.unit'),
            JSON_VALUE(value, '$.frequency'),
            JSON_VALUE(value, '$.description')
        FROM OPENJSON(@WastesJson);
        
        COMMIT TRANSACTION;
        
        SELECT 'تم إضافة أنواع النفايات بنجاح' AS Message;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        
        THROW;
    END CATCH
END
GO

-- =============================================
-- View: vw_FactoryDetails
-- =============================================
CREATE OR ALTER VIEW vw_FactoryDetails
AS
SELECT 
    f.Id,
    f.FactoryName,
    f.IndustryType,
    f.Location,
    f.Address,
    f.Phone,
    f.Email,
    f.OwnerName,
    f.OwnerPhone,
    f.TaxNumber,
    f.RegistrationNumber,
    f.EstablishmentYear,
    f.NumberOfEmployees,
    f.FactorySize,
    f.Website,
    f.LogoUrl,
    f.Verified,
    f.Status,
    f.CreatedAt,
    f.UpdatedAt,
    (
        SELECT 
            wt.WasteCode,
            wt.WasteAmount,
            wt.WasteUnit,
            wt.Frequency,
            wt.Description,
            wr.WasteNameAr,
            wr.WasteNameEn
        FROM FactoryWasteTypes wt
        INNER JOIN WasteTypesRef wr ON wt.WasteCode = wr.WasteCode
        WHERE wt.FactoryId = f.Id AND wt.IsActive = 1
        FOR JSON PATH
    ) AS WasteTypes
FROM Factories f;
GO

-- =============================================
-- Trigger: tr_UpdateTimestamp
-- =============================================
CREATE OR ALTER TRIGGER tr_Factories_UpdateTimestamp
ON Factories
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Factories
    SET UpdatedAt = GETDATE()
    FROM Factories f
    INNER JOIN inserted i ON f.Id = i.Id;
END
GO

CREATE OR ALTER TRIGGER tr_FactoryWasteTypes_UpdateTimestamp
ON FactoryWasteTypes
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE FactoryWasteTypes
    SET UpdatedAt = GETDATE()
    FROM FactoryWasteTypes fwt
    INNER JOIN inserted i ON fwt.Id = i.Id;
END
GO

-- =============================================
-- Sample Indexes for Performance
-- =============================================
CREATE NONCLUSTERED INDEX IX_Factories_Status_Verified 
ON Factories(Status, Verified) 
INCLUDE (FactoryName, Location, CreatedAt);

CREATE NONCLUSTERED INDEX IX_FactoryWasteTypes_Composite
ON FactoryWasteTypes(FactoryId, IsActive, WasteCode)
INCLUDE (WasteAmount, WasteUnit, Frequency);

GO

PRINT 'Database schema created successfully!';