namespace ShopBuStore.Utility
{
    public static class CustomProperties
    {
        public static string CreateNewCode(string firstChar)
        {
            DateTime now = DateTime.Now;
            return $"{firstChar}{now.Day}{now.Month}{now.Year}{now.Minute}{now.Microsecond}".ToString();
        }
    }
}
