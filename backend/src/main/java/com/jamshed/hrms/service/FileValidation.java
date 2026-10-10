package com.jamshed.hrms.service;
import com.jamshed.hrms.exception.BusinessException;
import org.springframework.web.multipart.MultipartFile;import java.io.*;import java.util.*;
public final class FileValidation {
 private FileValidation() {}
 public static String extension(MultipartFile f)throws IOException{
   if(f.isEmpty() || f.getSize()>5L*1024*1024)throw new BusinessException("File size must be between 1 byte and 5 MB");
   byte[] prefix;try(InputStream in=f.getInputStream()){prefix=in.readNBytes(8);}
   boolean pdf=prefix.length>=4 && prefix[0]=='%' && prefix[1]=='P' && prefix[2]=='D' && prefix[3]=='F';
   boolean jpg=prefix.length>=3 && (prefix[0]&0xff)==0xff && (prefix[1]&0xff)==0xd8 && (prefix[2]&0xff)==0xff;
   boolean png=prefix.length>=8 && (prefix[0]&0xff)==0x89 && prefix[1]=='P' && prefix[2]=='N' && prefix[3]=='G' && (prefix[4]&0xff)==13 && (prefix[5]&0xff)==10 && (prefix[6]&0xff)==26 && (prefix[7]&0xff)==10;
   if(pdf && "application/pdf".equals(f.getContentType()))return ".pdf";
   if(jpg && List.of("image/jpeg","image/jpg").contains(f.getContentType()))return ".jpg";
   if(png && "image/png".equals(f.getContentType()))return ".png";
   throw new BusinessException("Only valid PDF, JPEG and PNG files are supported");
 }
}
