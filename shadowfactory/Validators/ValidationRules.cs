using FluentValidation;
using shadowfactory.Models.DTOs;

namespace shadowfactory.Validators
{
    public class UserLoginRequestValidator : AbstractValidator<UserLoginRequest>
    {
        public UserLoginRequestValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email is invalid");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters");
        }
    }

    public class FactoryRegistrationRequestValidator : AbstractValidator<FactoryRegistrationRequest>
    {
        public FactoryRegistrationRequestValidator()
        {
            RuleFor(x => x.FactoryName)
                .NotEmpty().WithMessage("Factory name is required")
                .MaximumLength(255).WithMessage("Factory name cannot exceed 255 characters");

            RuleFor(x => x.IndustryType)
                .NotEmpty().WithMessage("Industry type is required");

            RuleFor(x => x.Location)
                .NotEmpty().WithMessage("Location is required");

            RuleFor(x => x.Address)
                .NotEmpty().WithMessage("Address is required")
                .MaximumLength(500).WithMessage("Address cannot exceed 500 characters");

            RuleFor(x => x.Phone)
                .NotEmpty().WithMessage("Phone number is required")
                .Matches(@"^\+?[0-9]{10,15}$").WithMessage("Phone number must be valid");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Email is invalid");

            RuleFor(x => x.OwnerName)
                .NotEmpty().WithMessage("Owner name is required")
                .MaximumLength(255).WithMessage("Owner name cannot exceed 255 characters");

            RuleFor(x => x.TaxNumber)
                .NotEmpty().WithMessage("Tax number is required")
                .MaximumLength(50).WithMessage("Tax number cannot exceed 50 characters");

            RuleFor(x => x.RegistrationNumber)
                .NotEmpty().WithMessage("Registration number is required")
                .MaximumLength(50).WithMessage("Registration number cannot exceed 50 characters");
        }
    }

    public class ChangePasswordRequestValidator : AbstractValidator<ChangePasswordRequest>
    {
        public ChangePasswordRequestValidator()
        {
            RuleFor(x => x.CurrentPassword)
                .NotEmpty().WithMessage("Current password is required");

            RuleFor(x => x.NewPassword)
                .NotEmpty().WithMessage("New password is required")
                .MinimumLength(8).WithMessage("New password must be at least 8 characters")
                .Matches("[A-Z]").WithMessage("Password must contain uppercase letter")
                .Matches("[a-z]").WithMessage("Password must contain lowercase letter")
                .Matches("[0-9]").WithMessage("Password must contain number")
                .NotEqual(x => x.CurrentPassword).WithMessage("New password must be different");

            RuleFor(x => x.ConfirmPassword)
                .NotEmpty().WithMessage("Password confirmation is required")
                .Equal(x => x.NewPassword).WithMessage("Passwords do not match");
        }
    }

    public class UpdateProfileRequestValidator : AbstractValidator<UpdateProfileRequest>
    {
        public UpdateProfileRequestValidator()
        {
            RuleFor(x => x.FullName)
                .NotEmpty().WithMessage("Name is required")
                .MaximumLength(255).WithMessage("Name cannot exceed 255 characters");

            RuleFor(x => x.Phone)
                .Matches(@"^\+?[0-9]{10,15}$").WithMessage("Phone number is invalid")
                .When(x => !string.IsNullOrEmpty(x.Phone));

            RuleFor(x => x.FactoryName)
                .MaximumLength(255).WithMessage("Factory name cannot exceed 255 characters")
                .When(x => !string.IsNullOrEmpty(x.FactoryName));
        }
    }
}
