using ShopBuStore.Models;

namespace ShopBuStore.Utility
{
    public static class FileOperation
    {
        public static async Task<string> ConvertIFormFileToBasee64(IFormFile file)
        {
            // Set image
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                byte[] imageBytes = memoryStream.ToArray();
                return Convert.ToBase64String(imageBytes);
            }
        }

        public static IFormFile ConvertBase64ToIFormFile(string base64String, string fileName, string contentType)
        {
            byte[] bytes = Convert.FromBase64String(base64String);
            var stream = new MemoryStream(bytes);
            return new FormFile(stream, 0, stream.Length, "file", fileName)
            {
                Headers = new HeaderDictionary(),
                ContentType = contentType
            };
        }

    }
}
