using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MessagingToolkit.QRCode.Codec;
using MessagingToolkit.QRCode.Codec.Data;
using System.Drawing;
using System.Globalization;
using System.Security.AccessControl;
using System.Security.Principal;
using System.IO;
using System.Security.Cryptography;

namespace Kunzad.Models
{
    class QRHandling
    {
        public Bitmap encode(string text)
        {
            QRCodeEncoder encoder = new QRCodeEncoder();
            Bitmap qrcode = encoder.Encode(text);
            return qrcode;
        }

        public string decode(Image image)
        {
            QRCodeDecoder decoder = new QRCodeDecoder();
            return decoder.decode(new QRCodeBitmapImage(image as Bitmap));
        }

        public string decode(Bitmap image)
        {
            QRCodeDecoder decoder = new QRCodeDecoder();
            return decoder.decode(new QRCodeBitmapImage(image));
        }

        public string decode(String path)
        {
            string text;
            if (System.IO.File.Exists(path))
            {
                Bitmap image = new Bitmap(path);
                QRCodeDecoder decoder = new QRCodeDecoder();

                // Do some processing
                for (int x = 0; x < image.Width; x++)
                {
                    for (int y = 0; y < image.Height; y++)
                    {
                        Color pixelColor = image.GetPixel(x, y);
                        Color newColor = Color.FromArgb(pixelColor.R, 0, 0);
                        image.SetPixel(x, y, newColor);
                    }
                }
                //Uncomment this if you want to save the image to other path
                //image.Save(path);
                text = decoder.decode(new QRCodeBitmapImage(image));
                image.Dispose();
                return text;
            }
            else
                return "File doesn't exist.";
        }

        public void saveQRImageToFile(string path, string imageName, Bitmap qrImage)
        {
            //Grant user access to folder
            DirectoryInfo dInfo = new DirectoryInfo(path);
            DirectorySecurity dSecurity = dInfo.GetAccessControl();
            dSecurity.AddAccessRule(new FileSystemAccessRule(new SecurityIdentifier(WellKnownSidType.WorldSid, null), FileSystemRights.FullControl, InheritanceFlags.ObjectInherit | InheritanceFlags.ContainerInherit, PropagationFlags.NoPropagateInherit, AccessControlType.Allow));
            dInfo.SetAccessControl(dSecurity);
            //if (System.IO.File.Exists(path + @"\" + imageName + @".png"))
            //    System.IO.File.Delete(path + @"\" + imageName + @".png");
            qrImage.Save(path + @"\" + imageName + @".png");
        }
        public string generateCode(int maxSize)
        {
            char[] chars = new char[62];
            chars =
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();
            byte[] data = new byte[1];
            using (RNGCryptoServiceProvider crypto = new RNGCryptoServiceProvider())
            {
                crypto.GetNonZeroBytes(data);
                data = new byte[maxSize];
                crypto.GetNonZeroBytes(data);
            }
            StringBuilder result = new StringBuilder(maxSize);
            foreach (byte b in data)
            {
                result.Append(chars[b % (chars.Length)]);
            }
            return result.ToString();
        }
    }
}
