using FluentValidation;
using shadowfactory.Models.DTOs;

namespace shadowfactory.Validators
{
    public class WasteListingUpdateRequestValidator : AbstractValidator<WasteListingUpdateRequest>
    {
        public WasteListingUpdateRequestValidator()
        {
            RuleFor(x => x.Amount).GreaterThan(0).When(x => x.Amount.HasValue);
            RuleFor(x => x.Price).GreaterThanOrEqualTo(0).When(x => x.Price.HasValue);
            RuleFor(x => x.Unit).MaximumLength(20).When(x => x.Unit != null);
        }
    }
}