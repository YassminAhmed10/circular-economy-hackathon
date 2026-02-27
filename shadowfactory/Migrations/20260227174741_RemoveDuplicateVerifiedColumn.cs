using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDuplicateVerifiedColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ============================================================
            // STEP 1: Remove unique indexes (if they still exist)
            // ============================================================
            // These operations are safe to run even if indexes don't exist
            try { migrationBuilder.DropIndex(name: "IX_Factories_Email", table: "Factories"); } catch { }
            try { migrationBuilder.DropIndex(name: "IX_Factories_RegistrationNumber", table: "Factories"); } catch { }
            try { migrationBuilder.DropIndex(name: "IX_Factories_TaxNumber", table: "Factories"); } catch { }

            // ============================================================
            // STEP 2: Handle Verified column (if it still exists)
            // ============================================================
            // Check if Verified column exists before trying to drop it
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'Verified')
                BEGIN
                    -- Drop default constraint if it exists
                    DECLARE @constraintName NVARCHAR(200);
                    SELECT @constraintName = name FROM sys.default_constraints 
                    WHERE parent_object_id = OBJECT_ID('Factories') AND parent_column_id = COLUMNPROPERTY(OBJECT_ID('Factories'), 'Verified', 'ColumnId');
                    
                    IF @constraintName IS NOT NULL
                        EXEC('ALTER TABLE Factories DROP CONSTRAINT [' + @constraintName + ']');
                    
                    -- Drop the column
                    ALTER TABLE Factories DROP COLUMN Verified;
                END
            ");

            // ============================================================
            // STEP 3: Rename NumberOfEmployees to EmployeeCount (if needed)
            // ============================================================
            // Only rename if NumberOfEmployees exists and EmployeeCount doesn't
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'NumberOfEmployees')
                AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'EmployeeCount')
                BEGIN
                    EXEC sp_rename 'Factories.NumberOfEmployees', 'EmployeeCount', 'COLUMN';
                END
            ");

            // ============================================================
            // STEP 4: Add IsVerified column (if it doesn't exist)
            // ============================================================
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'IsVerified')
                BEGIN
                    ALTER TABLE Factories ADD IsVerified BIT NOT NULL DEFAULT 0;
                END
            ");

            // ============================================================
            // STEP 5: Update VerificationTokens UpdatedAt default
            // ============================================================
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'VerificationTokens' AND COLUMN_NAME = 'UpdatedAt')
                BEGIN
                    -- Drop existing default constraint if any
                    DECLARE @constraintName NVARCHAR(200);
                    SELECT @constraintName = name FROM sys.default_constraints 
                    WHERE parent_object_id = OBJECT_ID('VerificationTokens') AND parent_column_id = COLUMNPROPERTY(OBJECT_ID('VerificationTokens'), 'UpdatedAt', 'ColumnId');
                    
                    IF @constraintName IS NOT NULL
                        EXEC('ALTER TABLE VerificationTokens DROP CONSTRAINT [' + @constraintName + ']');
                    
                    -- Add new default
                    ALTER TABLE VerificationTokens ADD CONSTRAINT DF_VerificationTokens_UpdatedAt DEFAULT GETUTCDATE() FOR UpdatedAt;
                END
            ");

            // ============================================================
            // STEP 6: Add user fields (if they don't exist)
            // ============================================================
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'AppNotifications')
                    ALTER TABLE Users ADD AppNotifications BIT NOT NULL DEFAULT 1;
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'EmailNotifications')
                    ALTER TABLE Users ADD EmailNotifications BIT NOT NULL DEFAULT 1;
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Phone')
                    ALTER TABLE Users ADD Phone NVARCHAR(20) NULL;
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'PublicProfile')
                    ALTER TABLE Users ADD PublicProfile BIT NOT NULL DEFAULT 1;
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'RegistrationDate')
                    ALTER TABLE Users ADD RegistrationDate DATETIME2 NULL DEFAULT GETUTCDATE();
            ");

            // ============================================================
            // STEP 7: Recreate indexes (if they don't exist)
            // ============================================================
            migrationBuilder.CreateIndex(
                name: "IX_Factories_Email",
                table: "Factories",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Factories_RegistrationNumber",
                table: "Factories",
                column: "RegistrationNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Factories_TaxNumber",
                table: "Factories",
                column: "TaxNumber");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // ============================================================
            // DOWN METHOD - Revert changes (if needed)
            // ============================================================

            // Drop indexes
            try { migrationBuilder.DropIndex(name: "IX_Factories_Email", table: "Factories"); } catch { }
            try { migrationBuilder.DropIndex(name: "IX_Factories_RegistrationNumber", table: "Factories"); } catch { }
            try { migrationBuilder.DropIndex(name: "IX_Factories_TaxNumber", table: "Factories"); } catch { }

            // Remove user fields
            try { migrationBuilder.DropColumn(name: "AppNotifications", table: "Users"); } catch { }
            try { migrationBuilder.DropColumn(name: "EmailNotifications", table: "Users"); } catch { }
            try { migrationBuilder.DropColumn(name: "Phone", table: "Users"); } catch { }
            try { migrationBuilder.DropColumn(name: "PublicProfile", table: "Users"); } catch { }
            try { migrationBuilder.DropColumn(name: "RegistrationDate", table: "Users"); } catch { }

            // Remove IsVerified
            try { migrationBuilder.DropColumn(name: "IsVerified", table: "Factories"); } catch { }

            // Rename back to NumberOfEmployees if needed
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'EmployeeCount')
                AND NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'NumberOfEmployees')
                BEGIN
                    EXEC sp_rename 'Factories.EmployeeCount', 'NumberOfEmployees', 'COLUMN';
                END
            ");

            // Reset VerificationTokens UpdatedAt default
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'VerificationTokens' AND COLUMN_NAME = 'UpdatedAt')
                BEGIN
                    DECLARE @constraintName NVARCHAR(200);
                    SELECT @constraintName = name FROM sys.default_constraints 
                    WHERE parent_object_id = OBJECT_ID('VerificationTokens') AND parent_column_id = COLUMNPROPERTY(OBJECT_ID('VerificationTokens'), 'UpdatedAt', 'ColumnId');
                    
                    IF @constraintName IS NOT NULL
                        EXEC('ALTER TABLE VerificationTokens DROP CONSTRAINT [' + @constraintName + ']');
                END
            ");

            // Add back Verified column (if needed for rollback)
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'Verified')
                BEGIN
                    ALTER TABLE Factories ADD Verified BIT NOT NULL DEFAULT 0;
                END
            ");

            // Recreate unique indexes
            try
            {
                migrationBuilder.CreateIndex(
                    name: "IX_Factories_Email",
                    table: "Factories",
                    column: "Email",
                    unique: true);
            }
            catch { }

            try
            {
                migrationBuilder.CreateIndex(
                    name: "IX_Factories_RegistrationNumber",
                    table: "Factories",
                    column: "RegistrationNumber",
                    unique: true);
            }
            catch { }

            try
            {
                migrationBuilder.CreateIndex(
                    name: "IX_Factories_TaxNumber",
                    table: "Factories",
                    column: "TaxNumber",
                    unique: true);
            }
            catch { }
        }
    }
}