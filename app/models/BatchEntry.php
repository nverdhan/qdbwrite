<?php

class BatchEntry extends Eloquent {

	protected $table = 'batchentries';
	protected $primaryKey = 'id';
	protected $guarded = array('*');
	protected $hidden = array('user_id');

	public function startEntry($chapterid){
		$batchentry = new BatchEntry;
		$batchentry->chapter_id = $chapterid;
		$batchentry->user_id = Auth::id();
		$batchentry->start_time = date('Y-m-d H:i:s');
		$batchentry->save();
		Session::put('entryStarted',true);
		Session::put('currentbatchid',$batchentry->id);
		return $batchentry->id;

	}

}