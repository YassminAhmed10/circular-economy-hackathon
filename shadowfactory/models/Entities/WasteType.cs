using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("WasteTypes")]
    public class WasteType
    {
        [Key]
        public int Id { get; set; }

        [Required, StringLength(100)]
        public string NameAr { get; set; } = string.Empty;

        [Required, StringLength(100)]
        public string NameEn { get; set; } = string.Empty;

        [StringLength(50)]
        public string? Icon { get; set; }
    }
}