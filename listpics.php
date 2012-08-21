<?php 
/*File simple script to list images in folder*/

$dir   = './pics';
$files = scandir($dir);
$imagesArr = array();
//print_r($files);
foreach ($files as $key => $imageName)
{
	//echo "<a href='$dir/$imageName'>$dir/$imageName </a><br/>";
	
	if(!is_dir ($imageName))
	{
		$imagePath = $dir.'/'.$imageName;
		$imageSize = getimagesize($imagePath);
		if($imageSize['0'])
		{
			
			$imageObject = array(
				'name' => $imageName,
				'width' => $imageSize['0'],
				'height' => $imageSize['1'],
				'mime' => $imageSize['mime']
			);
			array_push($imagesArr, $imageObject);
		}
	}
}

//$arr = array($files);

echo json_encode($imagesArr);

//print($json)

?>