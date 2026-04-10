using System;

namespace shadowfactory.Models.Entities
{
    public interface IHasTimestamps
    {
        DateTime CreatedAt { get; set; }
        DateTime UpdatedAt { get; set; }
    }
}