using System.Runtime.CompilerServices;

namespace clearTask.Server
{

    public class Logger
    {
        private static string infoLog_filename = "dbInfoLog";
        private static string downloadsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");

        internal static void InfoLog<T>(T model, [CallerMemberName] string functionName = "", params string[] functionParams)
        {
            try
            {
                string logFilePath = Path.Combine(downloadsPath, $"infoLog.txt");
                string modelValues = string.Empty;
                if (model != null)
                {
                    foreach (var property in model.GetType().GetProperties())
                    {
                        modelValues += (property.Name + ":" + (property?.GetValue(model))?.ToString() ?? null) + ", ";
                    }
                }

                using (StreamWriter writer = new StreamWriter(logFilePath, true))
                {
                    writer.WriteLine($"{DateTime.Now}: {functionName} | {modelValues} | {string.Join(", ", functionParams)}");
                }
            }
            catch (Exception) { }
        }
        internal static void ErrorLog(string logMessage, string fileName, string filePath = "")
        {
            try
            {
                // Specify the log file name
                string logFilePath = Path.Combine(filePath ?? downloadsPath, $"{fileName}_log.txt");

                // Append the log message to the file (create it if it doesn't exist)
                using (StreamWriter writer = new StreamWriter(logFilePath, true))
                {
                    writer.WriteLine($"{DateTime.Now}: {logMessage}");
                }
            }
            catch (Exception) { }
        }
    }
}
