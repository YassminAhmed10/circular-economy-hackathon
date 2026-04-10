using FluentValidation;
using shadowfactory.Models.DTOs;

namespace shadowfactory.Validators
{
    public class FactoryRegistrationRequestValidator : AbstractValidator<FactoryRegistrationRequest>
    {
        public FactoryRegistrationRequestValidator()
        {
            RuleFor(x => x.FactoryName).NotEmpty().MaximumLength(255);
            RuleFor(x => x.IndustryType).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Location).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Address).NotEmpty().MaximumLength(500);
            RuleFor(x => x.Phone).NotEmpty().MaximumLength(20);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.OwnerName).NotEmpty().MaximumLength(255);
            RuleFor(x => x.TaxNumber).NotEmpty();
            RuleFor(x => x.RegistrationNumber).NotEmpty();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
            RuleFor(x => x.EstablishmentYear).InclusiveBetween(1900, DateTime.UtcNow.Year).When(x => x.EstablishmentYear.HasValue);
        }
    }
}