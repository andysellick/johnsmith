<?php
    //this is just a test backend for the moment, will be better

    $arr = array();

    $arr[0] = array(
        'date' => "Jan 1 00:00:00 +0000 2014",
        'type' => 'other',
        'title' => 'This is a test item',
        'content' => '<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p><p>test</p><p>test</p>'
    );
    
    $arr[1] = array(
        'date' => "Feb 1 00:00:00 +0000 2014",
        'type' => 'education',
        'title' => 'This is another test item',
        'content' => '<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p><p>And what if it does, and that causes a huge space problem?</p><p>Well maybe I have been clever and fixed it. What do you think of that, eh?</p><p>test</p><p>test</p>'
    );
    
    $arr[2] = array(
        'date' => "Apr 1 00:00:00 +0000 2015",
        'type' => 'fun',
        'title' => 'hello',
        'content' => '<p>This is the content of the test item which I have made long in this instance to test some styles.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>It might contain a number of paragraphs.</p><p>test</p><p>test</p>'
    );

    $arr[3] = array(
        'date' => "Apr 1 00:00:00 +0000 2014",
        'type' => 'job',
        'title' => 'Boomtown',
        'content' => '<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p><p>And what if it does, and that causes a huge space problem?</p><p>test</p><p>test</p>'
    );
    $arr[4] = array(
        'date' => "Jul 1 00:00:00 +0000 2014",
        'type' => 'first',
        'title' => 'Boomtown',
        'content' => '<p>This is the content of the test item.</p><p>test</p><p>test</p>'
    );
    $arr[5] = array(
        'date' => "Mar 1 00:00:00 +0000 2015",
        'type' => 'travel',
        'title' => 'This is another test item',
        'content' => '<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p><p>test</p><p>test</p>'
    );
    $arr[6] = array(
        'date' => "Mar 2 00:00:00 +0000 2015",
        'type' => 'fun',
        'title' => 'This is another test item',
        'content' => '<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p><p>test</p><p>test</p>'
    );
    $arr[7] = array(
        'date' => "Mar 3 00:00:00 +0000 2015",
        'type' => 'fun',
        'title' => 'This is another test item',
        'content' => '<p>This is the content of the test item.</p><p>It might contain a number of paragraphs.</p><p>test</p><p>test</p>'
    );
    $arr[8] = array(
        'date' => "Sep 1 00:00:00 +0000 2015",
        'type' => 'fun',
        'title' => 'hello',
        'content' => '<p>This is the content of the test item which I have made long in this instance to test some styles.</p><p>It might contain a number of paragraphs.</p><p>test</p><p>test</p>'
    );
    
    foreach($arr as &$entry){ //THAT is something I did not know
        $entry['timestamp'] = strtotime($entry['date']);
    }

    //http://php.net/manual/en/function.ksort.php
    $sortArray = array();

    foreach($arr as $item){
        foreach($item as $key=>$value){
            if(!isset($sortArray[$key])){
                $sortArray[$key] = array();
            }
            $sortArray[$key][] = $value;
        }
    }
    $orderby = "timestamp"; //change this to whatever key you want from the array
    array_multisort($sortArray[$orderby],SORT_DESC,$arr);
    $arr = array_reverse($arr);

    echo json_encode($arr);
?>