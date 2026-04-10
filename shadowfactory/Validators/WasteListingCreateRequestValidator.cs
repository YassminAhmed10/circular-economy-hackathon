using FluentValidation;
using shadowfactory.Models.DTOs;

namespace shadowfactory.Validators
{
    public class WasteListingCreateRequestValidator : AbstractValidator<WasteListingCreateRequest>
    {
        public WasteListingCreateRequestValidator()
        {
            RuleFor(x => x.Type).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Amount).GreaterThan(0);
            RuleFor(x => x.Unit).NotEmpty().MaximumLength(20);
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0);
            RuleFor(x => x.Category).NotEmpty().MaximumLength(50);
        }
    }
}